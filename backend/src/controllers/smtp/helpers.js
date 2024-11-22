const dns = require('dns').promises;
const net = require('net');
const tls = require('tls');

// Common SMTP response codes and their meanings
const SMTP_RESPONSE_CODES = {
  '211': 'System status or help reply',
  '214': 'Help message',
  '220': 'Service ready',
  '221': 'Service closing transmission channel',
  '250': 'Requested mail action completed',
  '251': 'User not local; will forward',
  '252': 'Cannot verify user but will accept message',
  '354': 'Start mail input',
  '421': 'Service not available',
  '450': 'Requested mail action not taken: mailbox unavailable',
  '451': 'Requested action aborted: local error in processing',
  '452': 'Requested action not taken: insufficient system storage',
  '500': 'Syntax error, command unrecognized',
  '501': 'Syntax error in parameters or arguments',
  '502': 'Command not implemented',
  '503': 'Bad sequence of commands',
  '504': 'Command parameter not implemented',
  '521': 'Server does not accept mail',
  '550': 'Requested action not taken: mailbox unavailable',
  '551': 'User not local',
  '552': 'Requested mail action aborted: exceeded storage allocation',
  '553': 'Requested action not taken: mailbox name not allowed',
  '554': 'Transaction failed'
};

// Domain validation helper function
function validateDomain(domain) {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

// Helper function for basic SMTP server testing
async function testSMTPServer(host) {
  return new Promise(async (resolve, reject) => {
    const startTime = process.hrtime();
    const socket = new net.Socket();
    let response = '';
    let tlsSupported = false;
    let authMethods = [];
    let logs = [];
    let handshakeComplete = false;  // Track if initial handshake is complete

    const addLog = (type, message, details = {}) => {
      const timestamp = new Date().toISOString();
      logs.push({ timestamp, type, message, details });
      console.log(`[SMTP ${type}] ${timestamp} - ${message}`, details);
    };

    try {
      addLog('DNS', `Resolving DNS for host: ${host}`);
      const addresses = await dns.resolve(host);
      addLog('DNS', `Resolved IP addresses`, { addresses });

      addLog('DNS', `Attempting reverse DNS lookup for ${addresses[0]}`);
      const reverseDns = await dns.reverse(addresses[0]).catch(err => {
        addLog('DNS', `Reverse DNS lookup failed`, { error: err.message });
        return null;
      });
      if (reverseDns) {
        addLog('DNS', `Reverse DNS lookup successful`, { reverseDns });
      }

      addLog('CONNECT', `Attempting connection to ${host}:25`);
      socket.connect(25, host);

      socket.on('connect', () => {
        addLog('CONNECT', `Successfully connected to ${host}:25`);
      });

      socket.on('data', async (data) => {
        const receivedData = data.toString();
        addLog('RECEIVE', `Received server response`, { response: receivedData.trim() });
        
        // Handle initial server greeting
        if (receivedData.match(/^220 /) && !handshakeComplete) {
          response = receivedData;  // Reset response buffer
          addLog('SEND', `Sending EHLO command`);
          socket.write('EHLO example.com\r\n');
          handshakeComplete = true;
          return;
        }

        // Accumulate EHLO response
        response += receivedData;

        // Check for STARTTLS support
        if (receivedData.includes('250-STARTTLS')) {
          tlsSupported = true;
          addLog('FEATURE', `STARTTLS support detected`);
        }

        // Check for AUTH methods
        if (receivedData.includes('250-AUTH')) {
          authMethods = receivedData.match(/250-AUTH (.*)/)[1].split(' ');
          addLog('FEATURE', `Authentication methods detected`, { authMethods });
        }

        // Check if we've received the complete EHLO response
        if (receivedData.match(/250 .*\r\n/)) {
          const [seconds, nanoseconds] = process.hrtime(startTime);
          const responseTime = seconds * 1000 + nanoseconds / 1000000;
          
          addLog('COMPLETE', `SMTP test completed`, {
            responseTimeMs: responseTime,
            features: parseSmtpFeatures(response)
          });

          socket.destroy();
          
          resolve({
            ip: addresses[0],
            reverseDns: reverseDns ? reverseDns[0] : null,
            banner: response.split('\n')[0],
            tlsSupported,
            authMethods,
            features: parseSmtpFeatures(response),
            responseTimeMs: responseTime,
            logs
          });
        }
      });

      socket.on('error', (error) => {
        addLog('ERROR', `Socket error occurred`, { error: error.message });
        reject(new Error(`Connection failed: ${error.message}`));
      });

      socket.on('close', () => {
        addLog('CLOSE', `Connection closed`);
      });

      socket.setTimeout(5000, () => {
        addLog('TIMEOUT', `Connection timed out after 5000ms`);
        socket.destroy();
        reject(new Error('Connection timed out'));
      });
    } catch (error) {
      addLog('ERROR', `Test failed`, { error: error.message });
      reject(error);
    }
  });
}

// Rest of the code remains unchanged
const testTLSConnection = async (host) => {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();
    const socket = tls.connect({
      host,
      port: 465,
      rejectUnauthorized: false
    }, () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const cert = socket.getPeerCertificate(true);
      socket.end();
      
      resolve({
        secure: socket.authorized,
        protocol: socket.getProtocol(),
        cipher: socket.getCipher(),
        certificate: {
          subject: cert.subject,
          issuer: cert.issuer,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          fingerprint: cert.fingerprint
        },
        responseTimeMs: seconds * 1000 + nanoseconds / 1000000
      });
    });

    socket.on('error', (error) => {
      resolve({
        secure: false,
        error: error.message,
        responseTimeMs: 0
      });
    });

    socket.setTimeout(5000, () => {
      socket.destroy();
      resolve({
        secure: false,
        error: 'Connection timed out',
        responseTimeMs: 5000
      });
    });
  });
}

// Helper function to test common email ports
async function testCommonPorts(host) {
  const ports = {
    25: 'SMTP',
    465: 'SMTPS',
    587: 'Submission'
  };

  const results = {};
  for (const [port, service] of Object.entries(ports)) {
    const startTime = process.hrtime();
    try {
      const socket = await new Promise((resolve, reject) => {
        const s = new net.Socket();
        s.connect(parseInt(port), host, () => resolve(s));
        s.on('error', reject);
      });
      
      const [seconds, nanoseconds] = process.hrtime(startTime);
      socket.destroy();
      
      results[port] = {
        service,
        open: true,
        responseTimeMs: seconds * 1000 + nanoseconds / 1000000
      };
    } catch (error) {
      results[port] = {
        service,
        open: false,
        error: error.message,
        responseTimeMs: 0
      };
    }
  }
  return results;
}

// Helper function for comprehensive SMTP testing
async function comprehensiveSMTPTest(host) {
  const results = {
    basic: await testSMTPServer(host),
    tlsDetails: await testTLSConnection(host),
    portTests: await testCommonPorts(host),
    timestamp: new Date().toISOString()
  };

  // Add response time statistics
  results.averageResponseTime = (
    results.basic.responseTimeMs +
    results.tlsDetails.responseTimeMs +
    Object.values(results.portTests).reduce((acc, curr) => acc + curr.responseTimeMs, 0)
  ) / (2 + Object.keys(results.portTests).length);

  return results;
}

// Helper function to check SPF record
async function checkSPF(domain) {
  try {
    const records = await dns.resolveTxt(domain);
    const spfRecord = records
      .map(record => record.join(''))
      .find(record => record.startsWith('v=spf1'));
    
    if (!spfRecord) return null;

    return {
      record: spfRecord,
      mechanisms: parseSPFRecord(spfRecord),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return null;
  }
}

// Helper function to check DMARC record
async function checkDMARC(domain) {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records
      .map(record => record.join(''))
      .find(record => record.startsWith('v=DMARC1'));
    
    if (!dmarcRecord) return null;

    return {
      record: dmarcRecord,
      policy: parseDMARCRecord(dmarcRecord),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return null;
  }
}

// Helper function to parse SMTP features
function parseSmtpFeatures(response) {
  const features = {};
  response.split('\n').forEach(line => {
    if (line.startsWith('250-')) {
      const feature = line.substring(4).trim();
      const [name, ...params] = feature.split(' ');
      features[name] = params.length ? params.join(' ') : true;
    }
  });
  return features;
}

// Helper function to parse SPF record
function parseSPFRecord(record) {
  const parts = record.split(' ');
  return parts.slice(1).map(part => {
    const [mechanism, value] = part.split(':');
    return {
      mechanism,
      value: value || null
    };
  });
}

// Helper function to parse DMARC record
function parseDMARCRecord(record) {
  const parts = record.split(';').map(part => part.trim());
  const policy = {};
  
  parts.forEach(part => {
    const [key, value] = part.split('=').map(s => s.trim());
    policy[key] = value;
  });
  
  return policy;
}

// Helper function to analyze SMTP configuration
function analyzeSMTPConfiguration({ mxRecords, spfRecord, dmarcRecord, serverDiagnostics }) {
  const issues = [];
  const recommendations = [];

  // Check MX configuration
  if (mxRecords.length === 0) {
    issues.push('No MX records found');
    recommendations.push('Configure MX records for your domain');
  }

  // Check SPF
  if (!spfRecord) {
    issues.push('No SPF record found');
    recommendations.push('Implement SPF record to prevent email spoofing');
  }

  // Check DMARC
  if (!dmarcRecord) {
    issues.push('No DMARC record found');
    recommendations.push('Implement DMARC record to enhance email security');
  }

  // Analyze server diagnostics
  serverDiagnostics.forEach(server => {
    if (!server.tlsDetails?.secure) {
      issues.push(`TLS not properly configured on ${server.host}`);
      recommendations.push(`Configure TLS properly on ${server.host}`);
    }
  });

  return {
    issues,
    recommendations,
    securityScore: calculateSecurityScore({ spfRecord, dmarcRecord, serverDiagnostics }),
    timestamp: new Date().toISOString()
  };
}

// Helper function to calculate security score
function calculateSecurityScore({ spfRecord, dmarcRecord, serverDiagnostics }) {
  let score = 100;
  
  if (!spfRecord) score -= 20;
  if (!dmarcRecord) score -= 20;
  
  const tlsIssues = serverDiagnostics.filter(server => !server.tlsDetails?.secure).length;
  score -= (tlsIssues * 10);

  return Math.max(0, score);
}

module.exports = {
  SMTP_RESPONSE_CODES,
  testSMTPServer,
  comprehensiveSMTPTest,
  testTLSConnection,
  testCommonPorts,
  checkSPF,
  checkDMARC,
  analyzeSMTPConfiguration,
  validateDomain
};
