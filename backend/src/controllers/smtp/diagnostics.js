const { AppError } = require('../../middleware/errorHandler');
const dns = require('dns').promises;
const {
  comprehensiveSMTPTest,
  checkSPF,
  checkDMARC,
  analyzeSMTPConfiguration
} = require('./helpers');

// Timeout wrapper for promises
const withTimeout = (promise, timeoutMs, name = 'operation') => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeout]);
};

async function runDiagnostics(req, res, next) {
  const logs = [];
  const addLog = (type, message, details = {}) => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, type, message, details });
    console.log(`[SMTP Diagnostics ${type}] ${timestamp} - ${message}`, details);
  };

  try {
    const domain = req.validatedDomain;
    addLog('START', `Beginning diagnostics for domain: ${domain}`);
    const startTime = process.hrtime();

    // First get MX records with timeout
    addLog('MX', `Resolving MX records for ${domain}`);
    const mxRecords = await withTimeout(
      dns.resolveMx(domain),
      10000, // 10 seconds for DNS
      'MX lookup'
    ).catch(error => {
      addLog('ERROR', `MX lookup failed: ${error.message}`);
      return null;
    });

    // Get other DNS records in parallel with timeouts
    addLog('DNS', `Resolving additional DNS records`);
    const [txtRecords, spfRecord, dmarcRecord] = await Promise.all([
      withTimeout(
        dns.resolveTxt(domain),
        10000, // 10 seconds for DNS
        'TXT lookup'
      ).catch(error => {
        addLog('ERROR', `TXT lookup failed: ${error.message}`);
        return null;
      }),
      withTimeout(
        checkSPF(domain),
        10000, // 10 seconds for DNS
        'SPF check'
      ).catch(error => {
        addLog('ERROR', `SPF check failed: ${error.message}`);
        return null;
      }),
      withTimeout(
        checkDMARC(domain),
        10000, // 10 seconds for DNS
        'DMARC check'
      ).catch(error => {
        addLog('ERROR', `DMARC check failed: ${error.message}`);
        return null;
      })
    ]);

    // Test each MX server if MX records exist
    let serverDiagnostics = [];
    if (mxRecords && mxRecords.length > 0) {
      addLog('TEST', `Beginning SMTP server tests for ${mxRecords.length} MX records`);
      
      // Test servers with timeout
      const serverTests = mxRecords.map(mx => 
        withTimeout(
          (async () => {
            const serverStartTime = process.hrtime();
            addLog('TEST', `Testing MX server: ${mx.exchange}`, {
              priority: mx.priority
            });

            try {
              const serverDetails = await comprehensiveSMTPTest(mx.exchange);
              const [serverSeconds, serverNanoseconds] = process.hrtime(serverStartTime);
              const responseTime = serverSeconds * 1000 + serverNanoseconds / 1000000;

              addLog('SUCCESS', `Successfully tested MX server: ${mx.exchange}`, {
                responseTimeMs: responseTime
              });

              return {
                host: mx.exchange,
                priority: mx.priority,
                ...serverDetails,
                responseTimeMs: responseTime
              };
            } catch (error) {
              addLog('ERROR', `Failed testing MX server: ${mx.exchange}`, {
                error: error.message
              });
              return {
                host: mx.exchange,
                priority: mx.priority,
                error: error.message
              };
            }
          })(),
          50000, // 50 seconds per SMTP test (increased from 30)
          `SMTP test for ${mx.exchange}`
        ).catch(error => ({
          host: mx.exchange,
          priority: mx.priority,
          error: error.message
        }))
      );

      // Wait for all server tests with an overall timeout
      serverDiagnostics = await withTimeout(
        Promise.all(serverTests),
        90000, // 90 seconds total for all SMTP tests (increased from 60)
        'All SMTP tests'
      ).catch(error => {
        addLog('ERROR', `SMTP tests timed out: ${error.message}`);
        return serverTests.map((test, index) => ({
          host: mxRecords[index].exchange,
          priority: mxRecords[index].priority,
          error: 'Test timed out'
        }));
      });
    } else {
      addLog('WARN', `No MX records found for domain ${domain}`);
    }

    const [totalSeconds, totalNanoseconds] = process.hrtime(startTime);

    // Analyze results and generate recommendations
    const analysis = analyzeSMTPConfiguration({
      mxRecords: mxRecords || [],
      spfRecord,
      dmarcRecord,
      serverDiagnostics
    });

    addLog('COMPLETE', `Diagnostics completed for domain: ${domain}`, {
      totalTimeMs: totalSeconds * 1000 + totalNanoseconds / 1000000
    });

    // Send response immediately after completion
    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: totalSeconds * 1000 + totalNanoseconds / 1000000,
          timestamp: new Date().toISOString()
        },
        emailConfiguration: {
          mxRecords: mxRecords ? mxRecords.map(mx => ({
            host: mx.exchange,
            priority: mx.priority
          })) : [],
          txtRecords: txtRecords ? txtRecords.map(txt => txt.join('')) : [],
          spf: spfRecord,
          dmarc: dmarcRecord
        },
        serverDiagnostics,
        analysis,
        logs
      }
    });
  } catch (error) {
    addLog('ERROR', `Diagnostics failed with error`, {
      error: error.message,
      stack: error.stack
    });
    next(new AppError(error.statusCode || 500, error.message, { logs }));
  }
}

module.exports = runDiagnostics;
