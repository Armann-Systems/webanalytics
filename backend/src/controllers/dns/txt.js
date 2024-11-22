const { AppError } = require('../../middleware/errorHandler');
const { Resolver } = require('dns').promises;
const { performTimedDNSQuery, categorizeTextRecords } = require('./helpers');

async function getTXTRecords(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();
    
    const resolver = new Resolver();
    const txtData = await performTimedDNSQuery(resolver, domain, 'TXT');
    
    // Categorize TXT records
    const categorizedRecords = categorizeTextRecords(txtData.records);

    const [seconds, nanoseconds] = process.hrtime(startTime);
    
    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: seconds * 1000 + nanoseconds / 1000000,
          timestamp: new Date().toISOString()
        },
        records: categorizedRecords,
        ttl: txtData.ttl
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = getTXTRecords;
