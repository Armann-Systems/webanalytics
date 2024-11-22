const { AppError } = require('../../middleware/errorHandler');
const dns = require('dns').promises;
const { testSMTPServer } = require('./helpers');

async function testConnection(req, res, next) {
  const logs = [];
  const addLog = (type, message, details = {}) => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, type, message, details });
    console.log(`[SMTP Test ${type}] ${timestamp} - ${message}`, details);
  };

  try {
    const domain = req.validatedDomain;
    addLog('START', `Beginning SMTP test for domain: ${domain}`);
    const startTime = process.hrtime();

    // Get MX records with timing
    const mxStartTime = process.hrtime();
    addLog('MX', `Resolving MX records for ${domain}`);
    
    const mxRecords = await dns.resolveMx(domain);
    const [mxSeconds, mxNanoseconds] = process.hrtime(mxStartTime);
    const mxLookupTime = mxSeconds * 1000 + mxNanoseconds / 1000000;
    
    addLog('MX', `MX record lookup completed`, {
      recordCount: mxRecords?.length || 0,
      lookupTimeMs: mxLookupTime
    });

    if (!mxRecords || mxRecords.length === 0) {
      addLog('ERROR', `No MX records found for domain ${domain}`);
      throw new AppError(404, 'No MX records found for domain');
    }

    // Sort by priority
    mxRecords.sort((a, b) => a.priority - b.priority);
    addLog('MX', `Sorted MX records by priority`, {
      records: mxRecords.map(mx => ({
        exchange: mx.exchange,
        priority: mx.priority
      }))
    });

    // Test each MX server with detailed diagnostics
    addLog('TEST', `Beginning SMTP server tests for ${mxRecords.length} MX records`);
    const serverTests = await Promise.all(
      mxRecords.map(async (mx) => {
        const serverStartTime = process.hrtime();
        addLog('TEST', `Testing MX server: ${mx.exchange}`, {
          priority: mx.priority
        });

        try {
          const connectionDetails = await testSMTPServer(mx.exchange);
          const [serverSeconds, serverNanoseconds] = process.hrtime(serverStartTime);
          const responseTime = serverSeconds * 1000 + serverNanoseconds / 1000000;
          
          addLog('SUCCESS', `Successfully tested MX server: ${mx.exchange}`, {
            responseTimeMs: responseTime,
            features: connectionDetails.features
          });
          
          return {
            host: mx.exchange,
            priority: mx.priority,
            responseTimeMs: responseTime,
            ...connectionDetails,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          const [serverSeconds, serverNanoseconds] = process.hrtime(serverStartTime);
          const responseTime = serverSeconds * 1000 + serverNanoseconds / 1000000;
          
          addLog('ERROR', `Failed testing MX server: ${mx.exchange}`, {
            error: error.message,
            responseTimeMs: responseTime
          });
          
          return {
            host: mx.exchange,
            priority: mx.priority,
            responseTimeMs: responseTime,
            error: error.message,
            timestamp: new Date().toISOString()
          };
        }
      })
    );

    const [totalSeconds, totalNanoseconds] = process.hrtime(startTime);
    const totalTime = totalSeconds * 1000 + totalNanoseconds / 1000000;

    addLog('COMPLETE', `SMTP test completed for domain: ${domain}`, {
      totalTimeMs: totalTime,
      successfulTests: serverTests.filter(test => !test.error).length,
      failedTests: serverTests.filter(test => test.error).length
    });

    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: totalTime,
          mxLookupTimeMs: mxLookupTime,
          timestamp: new Date().toISOString()
        },
        mxRecords: serverTests,
        logs
      }
    });
  } catch (error) {
    addLog('ERROR', `Test failed with error`, {
      error: error.message,
      stack: error.stack
    });
    
    next(new AppError(error.statusCode || 500, error.message, { logs }));
  }
}

module.exports = testConnection;
