const dns = require('dns').promises;
const { Resolver } = require('dns').promises;
const dnsPacket = require('dns-packet');
const net = require('net');

// List of popular DNS providers for checking NS delegation
const DNS_PROVIDERS = {
  'GOOGLE': ['ns1.google.com', 'ns2.google.com', 'ns3.google.com', 'ns4.google.com'],
  'CLOUDFLARE': ['ns1.cloudflare.com', 'ns2.cloudflare.com', 'ns3.cloudflare.com', 'ns4.cloudflare.com'],
  'AMAZON_ROUTE53': ['ns-1.awsdns', 'ns-2.awsdns', 'ns-3.awsdns', 'ns-4.awsdns'],
  'GODADDY': ['ns1.domaincontrol.com', 'ns2.domaincontrol.com'],
  'NAMECHEAP': ['dns1.registrar-servers.com', 'dns2.registrar-servers.com']
};

// Map record types to resolver method names
const RECORD_TYPE_MAP = {
  'A': 'resolve4',
  'AAAA': 'resolve6',
  'TXT': 'resolveTxt',
  'MX': 'resolveMx',
  'NS': 'resolveNs',
  'SOA': 'resolveSoa',
  'CNAME': 'resolveCname'
};

// Helper function for timed DNS queries
async function performTimedDNSQuery(resolver, domain, recordType) {
  const startTime = process.hrtime();
  try {
    const resolverMethod = RECORD_TYPE_MAP[recordType];
    if (!resolverMethod) {
      throw new Error(`Unsupported record type: ${recordType}`);
    }
    
    const records = await resolver[resolverMethod](domain);
    const [seconds, nanoseconds] = process.hrtime(startTime);
    return {
      records,
      queryTimeMs: seconds * 1000 + nanoseconds / 1000000,
      ttl: await getTTL(domain, recordType),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      records: [],
      error: error.message,
      queryTimeMs: 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Helper function to get TTL
async function getTTL(domain, recordType) {
  try {
    const packet = await sendDNSQuery(domain, recordType);
    return packet.answers[0]?.ttl || null;
  } catch (error) {
    return null;
  }
}

// Helper function to send raw DNS query
function sendDNSQuery(domain, recordType) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const query = dnsPacket.encode({
      type: 'query',
      id: Math.floor(Math.random() * 65534) + 1,
      flags: dnsPacket.RECURSION_DESIRED,
      questions: [{
        type: recordType,
        name: domain
      }]
    });

    socket.connect(53, '8.8.8.8', () => {
      socket.write(query);
    });

    socket.on('data', (data) => {
      try {
        const response = dnsPacket.decode(data);
        socket.destroy();
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });

    socket.on('error', reject);
    setTimeout(() => {
      socket.destroy();
      reject(new Error('DNS query timeout'));
    }, 5000);
  });
}

// Helper function to check mail server details
async function checkMailServer(hostname) {
  try {
    const addresses = await dns.resolve(hostname);
    const startTime = process.hrtime();
    
    // Test SMTP connection
    const socket = new net.Socket();
    const connectionTest = await new Promise((resolve) => {
      socket.connect(25, addresses[0], () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        socket.destroy();
        resolve({
          connected: true,
          responseTime: seconds * 1000 + nanoseconds / 1000000
        });
      });

      socket.on('error', () => {
        resolve({
          connected: false,
          error: 'Connection failed'
        });
      });
    });

    return {
      addresses,
      connectionTest,
      reverseDns: await getReverseDns(addresses[0])
    };
  } catch (error) {
    return {
      error: error.message,
      connectionTest: {
        connected: false,
        error: 'Resolution failed'
      }
    };
  }
}

// Helper function for reverse DNS lookup
async function getReverseDns(ip) {
  try {
    const hostnames = await dns.reverse(ip);
    return hostnames[0] || null;
  } catch (error) {
    return null;
  }
}

// Helper function to identify DNS provider
function identifyDNSProvider(nameserver) {
  for (const [provider, servers] of Object.entries(DNS_PROVIDERS)) {
    if (servers.some(server => nameserver.toLowerCase().includes(server.toLowerCase()))) {
      return provider;
    }
  }
  return 'UNKNOWN';
}

// Helper function to check DNS propagation
async function checkDNSPropagation(domain) {
  const publicDnsServers = [
    { name: 'Google', ip: '8.8.8.8' },
    { name: 'Cloudflare', ip: '1.1.1.1' },
    { name: 'Quad9', ip: '9.9.9.9' },
    { name: 'OpenDNS', ip: '208.67.222.222' }
  ];

  return Promise.all(
    publicDnsServers.map(async (server) => {
      const resolver = new Resolver();
      resolver.setServers([server.ip]);
      
      const startTime = process.hrtime();
      try {
        await resolver.resolve4(domain);
        const [seconds, nanoseconds] = process.hrtime(startTime);
        return {
          server: server.name,
          ip: server.ip,
          propagated: true,
          responseTime: seconds * 1000 + nanoseconds / 1000000
        };
      } catch (error) {
        return {
          server: server.name,
          ip: server.ip,
          propagated: false,
          error: error.message
        };
      }
    })
  );
}

// Helper function to check DNSSEC
async function checkDNSSEC(domain) {
  try {
    const packet = await sendDNSQuery(domain, 'DNSKEY');
    const hasDNSKEY = packet.answers.length > 0;
    
    const dsPacket = await sendDNSQuery(domain, 'DS');
    const hasDS = dsPacket.answers.length > 0;

    return {
      enabled: hasDNSKEY && hasDS,
      dnskey: hasDNSKEY,
      ds: hasDS,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      enabled: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Helper function to categorize TXT records
function categorizeTextRecords(records) {
  return records.map(record => {
    const txt = Array.isArray(record) ? record.join('') : record;
    let category = 'OTHER';
    let type = 'UNKNOWN';

    if (txt.startsWith('v=spf1')) {
      category = 'EMAIL';
      type = 'SPF';
    } else if (txt.startsWith('v=DMARC1')) {
      category = 'EMAIL';
      type = 'DMARC';
    } else if (txt.includes('google-site-verification')) {
      category = 'VERIFICATION';
      type = 'GOOGLE';
    } else if (txt.includes('MS=')) {
      category = 'VERIFICATION';
      type = 'MICROSOFT';
    } else if (txt.includes('docker-verification')) {
      category = 'VERIFICATION';
      type = 'DOCKER';
    } else if (txt.includes('stripe-verification')) {
      category = 'VERIFICATION';
      type = 'STRIPE';
    }

    return {
      record: txt,
      category,
      type,
      length: txt.length
    };
  });
}

module.exports = {
  performTimedDNSQuery,
  checkMailServer,
  identifyDNSProvider,
  checkDNSPropagation,
  checkDNSSEC,
  categorizeTextRecords
};
