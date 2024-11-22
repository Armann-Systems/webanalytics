const { AppError } = require('../../middleware/errorHandler');
const { Resolver } = require('dns').promises;
const { performTimedDNSQuery, checkMailServer } = require('./helpers');

async function getMXRecords(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();
    
    const resolver = new Resolver();
    const mxData = await performTimedDNSQuery(resolver, domain, 'MX');
    
    // Additional SMTP server checks
    const mxDetails = await Promise.all(
      (mxData.records || []).map(async (record) => {
        const serverDetails = await checkMailServer(record.exchange);
        return {
          ...record,
          ...serverDetails
        };
      })
    );

    const [seconds, nanoseconds] = process.hrtime(startTime);
    
    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: seconds * 1000 + nanoseconds / 1000000,
          timestamp: new Date().toISOString()
        },
        mxRecords: mxDetails,
        ttl: mxData.ttl
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = getMXRecords;
