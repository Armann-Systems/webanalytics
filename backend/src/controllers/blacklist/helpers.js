const dns = require('dns').promises;

// Comprehensive list of DNSBL providers with metadata
const DNSBL_PROVIDERS = [
  {
    host: 'zen.spamhaus.org',
    name: 'Spamhaus ZEN',
    description: 'Combines SBL, SBLCSS, XBL and PBL zones',
    reliability: 9.9,
    responseFormat: {
      '127.0.0.2': 'SBL - Spamhaus Maintained',
      '127.0.0.3': 'SBL - CSS - Snowshoe',
      '127.0.0.4': 'XBL - CBL Detected',
      '127.0.0.9': 'SBL - DROP/EDROP Data',
      '127.0.0.10': 'PBL - ISP Maintained',
      '127.0.0.11': 'PBL - Spamhaus Maintained'
    }
  },
  {
    host: 'bl.spamcop.net',
    name: 'SpamCop',
    description: 'Collaborative spam reporting system',
    reliability: 9.5,
    responseFormat: {
      '127.0.0.2': 'Listed in SpamCop'
    }
  },
  {
    host: 'dnsbl.sorbs.net',
    name: 'SORBS',
    description: 'Spam and Open Relay Blocking System',
    reliability: 8.7,
    responseFormat: {
      '127.0.0.2': 'HTTP Proxy',
      '127.0.0.3': 'SOCKS Proxy',
      '127.0.0.4': 'MISC',
      '127.0.0.5': 'SMTP Server',
      '127.0.0.6': 'Possible Spam Source',
      '127.0.0.7': 'Verified Spam Source',
      '127.0.0.8': 'Hijacked Network',
      '127.0.0.9': 'Dynamic IP',
      '127.0.0.10': 'Block Range',
      '127.0.0.11': 'Zombie Network',
      '127.0.0.12': 'DNS Server',
      '127.0.0.14': 'Web Server'
    }
  },
  {
    host: 'cbl.abuseat.org',
    name: 'Composite Blocking List',
    description: 'Detects compromised hosts',
    reliability: 9.2,
    responseFormat: {
      '127.0.0.2': 'Listed in CBL'
    }
  },
  {
    host: 'b.barracudacentral.org',
    name: 'Barracuda',
    description: 'Commercial reputation system',
    reliability: 9.0,
    responseFormat: {
      '127.0.0.2': 'Listed in Barracuda'
    }
  },
  {
    host: 'dnsbl-1.uceprotect.net',
    name: 'UCEPROTECT Level 1',
    description: 'Automated spam source detection',
    reliability: 8.5,
    responseFormat: {
      '127.0.0.2': 'Listed in UCEPROTECT'
    }
  }
];

// Helper function to calculate reliability score
function calculateReliabilityScore(results) {
  const listedResults = results.filter(result => result.listed);
  if (listedResults.length === 0) return 100;

  const weightedScore = listedResults.reduce((acc, curr) => {
    return acc + (10 - curr.reliability);
  }, 0);

  return Math.max(0, 100 - (weightedScore * 10));
}

// Helper function to calculate risk level
function calculateRiskLevel(listedCount, reliabilityScore) {
  if (listedCount === 0) return { level: 'LOW', score: 0 };
  
  const riskScore = (listedCount / DNSBL_PROVIDERS.length * 100) * (1 - reliabilityScore / 100);
  
  if (riskScore < 20) return { level: 'LOW', score: riskScore };
  if (riskScore < 50) return { level: 'MEDIUM', score: riskScore };
  if (riskScore < 80) return { level: 'HIGH', score: riskScore };
  return { level: 'CRITICAL', score: riskScore };
}

// Helper function to calculate domain risk
function calculateDomainRisk(ipChecks) {
  const totalChecks = ipChecks.length * DNSBL_PROVIDERS.length;
  const totalListings = ipChecks.reduce((acc, check) => acc + check.listedCount, 0);
  
  const riskScore = (totalListings / totalChecks) * 100;
  
  return {
    score: riskScore,
    level: riskScore === 0 ? 'LOW' :
           riskScore < 20 ? 'MEDIUM' :
           riskScore < 50 ? 'HIGH' : 'CRITICAL'
  };
}

// Helper function to get network information
async function getNetworkInfo(ip) {
  try {
    const reverseDns = await dns.reverse(ip).catch(() => null);
    
    return {
      reverseDns: reverseDns ? reverseDns[0] : null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  DNSBL_PROVIDERS,
  calculateReliabilityScore,
  calculateRiskLevel,
  calculateDomainRisk,
  getNetworkInfo
};
