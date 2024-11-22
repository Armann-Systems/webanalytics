const { AppError } = require('../../middleware/errorHandler');
const { Resolver } = require('dns').promises;
const { performTimedDNSQuery } = require('./helpers');

async function getSPFRecords(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();
    
    const resolver = new Resolver();
    const txtData = await performTimedDNSQuery(resolver, domain, 'TXT');
    
    // Filter and parse SPF records
    const spfRecords = txtData.records
      .flat()
      .filter(record => typeof record === 'string' && record.startsWith('v=spf1'))
      .map(record => {
        const mechanisms = record.split(' ').slice(1);
        return {
          raw: record,
          mechanisms: mechanisms.map(mech => {
            const qualifier = mech.charAt(0);
            const type = qualifier === '+' || qualifier === '-' || qualifier === '?' || qualifier === '~' 
              ? mech.substring(1) 
              : mech;
            return {
              qualifier: ['~', '-', '?'].includes(qualifier) ? qualifier : '+',
              type: type.split(':')[0],
              value: type.includes(':') ? type.split(':')[1] : null
            };
          }),
          policy: mechanisms.find(m => m === 'all' || m === '~all' || m === '-all' || m === '?all') || 'none'
        };
      });

    const [seconds, nanoseconds] = process.hrtime(startTime);
    
    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: seconds * 1000 + nanoseconds / 1000000,
          timestamp: new Date().toISOString()
        },
        spfRecords,
        count: spfRecords.length,
        ttl: txtData.ttl,
        valid: spfRecords.length === 1 // RFC 7208 states there should be exactly one SPF record
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = getSPFRecords;
