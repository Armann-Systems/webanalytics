const tls = require('tls');
const { AppError } = require('../../middleware/errorHandler');

// SSL/TLS protocols to test
const TLS_VERSIONS = [
  'TLSv1.3',
  'TLSv1.2',
  'TLSv1.1',
  'TLSv1'
];

// Common cipher suites to test
const CIPHER_PREFERENCES = [
  'ECDHE-ECDSA-AES256-GCM-SHA384',
  'ECDHE-RSA-AES256-GCM-SHA384',
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-RSA-CHACHA20-POLY1305',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'ECDHE-ECDSA-AES256-SHA384',
  'ECDHE-RSA-AES256-SHA384',
  'ECDHE-ECDSA-AES128-SHA256',
  'ECDHE-RSA-AES128-SHA256'
];

// Helper function to get detailed certificate information
async function getCertificateInfo(domain, port) {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();
    const socket = tls.connect({
      host: domain,
      port: port,
      servername: domain,
      rejectUnauthorized: false // Allow self-signed for inspection
    }, () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const cert = socket.getPeerCertificate(true);
      const protocol = socket.getProtocol();
      const cipher = socket.getCipher();
      socket.end();

      if (!cert) {
        reject(new AppError(404, 'No SSL certificate found'));
        return;
      }

      resolve({
        subject: cert.subject,
        issuer: cert.issuer,
        subjectAltNames: parseSAN(cert.subjectaltname),
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        serialNumber: cert.serialNumber,
        fingerprints: {
          sha1: cert.fingerprint,
          sha256: cert.fingerprint256
        },
        version: cert.version,
        keyUsage: cert.ext_key_usage,
        extendedKeyUsage: cert.ext_key_usage,
        ocspServers: cert.infoAccess?.['OCSP - URI'] || [],
        caIssuers: cert.infoAccess?.['CA Issuers - URI'] || [],
        signatureAlgorithm: cert.signatureAlgorithm,
        publicKeyAlgorithm: cert.publicKey?.algorithm,
        publicKeySize: cert.publicKey?.size,
        chain: extractCertificateChain(cert),
        connection: {
          protocol,
          cipher,
          responseTimeMs: seconds * 1000 + nanoseconds / 1000000
        }
      });
    });

    socket.on('error', (error) => {
      reject(new AppError(500, `SSL connection failed: ${error.message}`));
    });

    socket.setTimeout(10000, () => {
      socket.destroy();
      reject(new AppError(408, 'SSL connection timed out'));
    });
  });
}

// Helper function to test TLS version support
async function testTLSVersions(domain) {
  const results = {};
  
  for (const version of TLS_VERSIONS) {
    const startTime = process.hrtime();
    try {
      const socket = tls.connect({
        host: domain,
        port: 443,
        servername: domain,
        minVersion: version,
        maxVersion: version,
        rejectUnauthorized: false
      });

      await new Promise((resolve, reject) => {
        socket.on('secureConnect', () => {
          const [seconds, nanoseconds] = process.hrtime(startTime);
          socket.end();
          resolve();
          results[version] = {
            supported: true,
            responseTimeMs: seconds * 1000 + nanoseconds / 1000000
          };
        });

        socket.on('error', () => {
          results[version] = {
            supported: false,
            responseTimeMs: 0
          };
          resolve();
        });
      });
    } catch (error) {
      results[version] = {
        supported: false,
        error: error.message
      };
    }
  }

  return results;
}

// Helper function to test cipher suite support
async function testCipherSuites(domain) {
  const results = {};
  
  for (const cipher of CIPHER_PREFERENCES) {
    const startTime = process.hrtime();
    try {
      const socket = tls.connect({
        host: domain,
        port: 443,
        servername: domain,
        ciphers: cipher,
        rejectUnauthorized: false
      });

      await new Promise((resolve, reject) => {
        socket.on('secureConnect', () => {
          const [seconds, nanoseconds] = process.hrtime(startTime);
          socket.end();
          resolve();
          results[cipher] = {
            supported: true,
            responseTimeMs: seconds * 1000 + nanoseconds / 1000000
          };
        });

        socket.on('error', () => {
          results[cipher] = {
            supported: false,
            responseTimeMs: 0
          };
          resolve();
        });
      });
    } catch (error) {
      results[cipher] = {
        supported: false,
        error: error.message
      };
    }
  }

  return results;
}

// Helper function to analyze certificate security
function analyzeCertificateSecurity(certInfo) {
  if (!certInfo || certInfo.error) {
    return {
      score: 0,
      grade: 'F',
      issues: ['Unable to analyze certificate'],
      recommendations: ['Check if the domain has a valid SSL certificate']
    };
  }

  const issues = [];
  const recommendations = [];
  let score = 100;

  // Check signature algorithm
  if (certInfo.signatureAlgorithm && 
      (certInfo.signatureAlgorithm.includes('SHA1') || 
       certInfo.signatureAlgorithm.includes('MD5'))) {
    score -= 30;
    issues.push('Weak signature algorithm');
    recommendations.push('Upgrade to SHA-256 or better');
  }

  // Check key size
  if (certInfo.publicKeySize && certInfo.publicKeySize < 2048) {
    score -= 30;
    issues.push('Weak key size');
    recommendations.push('Use at least 2048-bit key size');
  }

  // Check validity period
  if (certInfo.validTo) {
    const now = new Date();
    const validTo = new Date(certInfo.validTo);
    const daysRemaining = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 30) {
      score -= 20;
      issues.push('Certificate expiring soon');
      recommendations.push('Renew certificate');
    }
  }

  // Check for wildcard certificates
  if (certInfo.subject && certInfo.subject.CN && certInfo.subject.CN.startsWith('*.')) {
    score -= 5;
    issues.push('Wildcard certificate in use');
    recommendations.push('Consider using SAN certificates instead of wildcards');
  }

  return {
    score,
    grade: getSecurityGrade(score),
    issues,
    recommendations
  };
}

// Helper function to parse Subject Alternative Names
function parseSAN(sanString) {
  if (!sanString) return [];
  return sanString.split(', ').map(san => {
    const [type, value] = san.split(':');
    return { type, value };
  });
}

// Helper function to extract certificate chain
function extractCertificateChain(cert) {
  const chain = [];
  let current = cert;
  
  while (current && current.issuerCertificate) {
    chain.push({
      subject: current.subject,
      issuer: current.issuer,
      validFrom: current.valid_from,
      validTo: current.valid_to,
      serialNumber: current.serialNumber
    });
    
    if (current === current.issuerCertificate) break;
    current = current.issuerCertificate;
  }
  
  return chain;
}

// Helper function to check Certificate Transparency logs
async function checkCTLogs(serialNumber) {
  // Note: This is a placeholder. In a real implementation,
  // you would query actual CT logs via their APIs
  return {
    included: true,
    logs: [
      'Google Argon2022',
      'Cloudflare Nimbus2022'
    ]
  };
}

// Helper function to get expiry status
function getExpiryStatus(daysRemaining) {
  if (daysRemaining < 0) {
    return {
      level: 'CRITICAL',
      message: 'Certificate has expired'
    };
  } else if (daysRemaining <= 7) {
    return {
      level: 'HIGH',
      message: 'Certificate expires in less than a week'
    };
  } else if (daysRemaining <= 30) {
    return {
      level: 'MEDIUM',
      message: 'Certificate expires in less than a month'
    };
  } else if (daysRemaining <= 90) {
    return {
      level: 'LOW',
      message: 'Certificate expires in less than three months'
    };
  } else {
    return {
      level: 'INFO',
      message: 'Certificate is valid'
    };
  }
}

// Helper function to get security grade
function getSecurityGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D+';
  if (score >= 45) return 'D';
  if (score >= 40) return 'D-';
  return 'F';
}

// Helper function to generate expiry recommendations
function generateExpiryRecommendations(daysRemaining, validityPercentageUsed) {
  const recommendations = [];

  if (daysRemaining < 90) {
    recommendations.push('Plan certificate renewal');
  }
  if (daysRemaining < 30) {
    recommendations.push('Urgent: Renew certificate soon');
  }
  if (validityPercentageUsed > 75) {
    recommendations.push('Consider automating certificate renewal');
  }
  if (daysRemaining < 7) {
    recommendations.push('Critical: Immediate certificate renewal required');
  }

  return recommendations;
}

module.exports = {
  TLS_VERSIONS,
  CIPHER_PREFERENCES,
  getCertificateInfo,
  testTLSVersions,
  testCipherSuites,
  analyzeCertificateSecurity,
  checkCTLogs,
  getExpiryStatus,
  generateExpiryRecommendations
};
