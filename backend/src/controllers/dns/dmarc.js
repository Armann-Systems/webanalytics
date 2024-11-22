const { AppError } = require('../../middleware/errorHandler');
const { Resolver } = require('dns').promises;
const { performTimedDNSQuery } = require('./helpers');

async function getDMARCRecords(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();
    
    const resolver = new Resolver();
    const dmarcDomain = `_dmarc.${domain}`;
    const txtData = await performTimedDNSQuery(resolver, dmarcDomain, 'TXT');
    
    // Filter and parse DMARC records
    const dmarcRecords = txtData.records
      .flat()
      .filter(record => typeof record === 'string' && record.startsWith('v=DMARC1'))
      .map(record => {
        const tags = record.split(';').map(tag => tag.trim());
        const parsedTags = {};
        
        tags.forEach(tag => {
          const [key, value] = tag.split('=').map(s => s.trim());
          if (key && value) {
            parsedTags[key] = value;
          }
        });

        return {
          raw: record,
          version: parsedTags['v'],
          policy: parsedTags['p'],
          subdomainPolicy: parsedTags['sp'],
          percentage: parsedTags['pct'],
          reportingOptions: {
            aggregateReports: parsedTags['rua'],
            forensicReports: parsedTags['ruf']
          },
          alignmentMode: {
            spf: parsedTags['aspf'],
            dkim: parsedTags['adkim']
          }
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
        dmarcRecords,
        count: dmarcRecords.length,
        ttl: txtData.ttl,
        valid: dmarcRecords.length === 1 // There should be exactly one DMARC record
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = getDMARCRecords;
