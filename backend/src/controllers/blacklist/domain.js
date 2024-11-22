const { AppError } = require('../../middleware/errorHandler');
const dns = require('dns').promises;
const {
  DNSBL_PROVIDERS,
  calculateReliabilityScore,
  calculateRiskLevel,
  getNetworkInfo
} = require('./helpers');

async function checkDomain(req, res, next) {
  try {
    const { domain } = req.query; // Changed from req.params to req.query to match route definition
    const startTime = process.hrtime();

    // Get all A records for the domain
    const aRecords = await dns.resolve4(domain).catch(() => []);
    
    // Get MX records
    const mxRecords = await dns.resolveMx(domain).catch(() => []);

    // Check each IP from A records against blacklists
    const ipChecks = await Promise.all(
      aRecords.map(async (ip) => {
        const reversedIp = ip.split('.').reverse().join('.');
        
        const results = await Promise.all(
          DNSBL_PROVIDERS.map(async (provider) => {
            const checkStartTime = process.hrtime();
            try {
              const lookupAddress = `${reversedIp}.${provider.host}`;
              const records = await dns.resolve(lookupAddress);
              const [seconds, nanoseconds] = process.hrtime(checkStartTime);
              
              const responseCode = records[0];
              const listingDetails = provider.responseFormat[responseCode] || 'Unknown listing type';

              return {
                provider: provider.name,
                host: provider.host,
                description: provider.description,
                reliability: provider.reliability,
                listed: true,
                responseTimeMs: seconds * 1000 + nanoseconds / 1000000,
                listingDetails,
                responseCode,
                timestamp: new Date().toISOString()
              };
            } catch (error) {
              const [seconds, nanoseconds] = process.hrtime(checkStartTime);
              return {
                provider: provider.name,
                host: provider.host,
                description: provider.description,
                reliability: provider.reliability,
                listed: false,
                responseTimeMs: seconds * 1000 + nanoseconds / 1000000,
                error: error.code,
                timestamp: new Date().toISOString()
              };
            }
          })
        );

        return {
          ip,
          results,
          networkInfo: await getNetworkInfo(ip)
        };
      })
    );

    // Calculate overall metrics
    const [totalSeconds, totalNanoseconds] = process.hrtime(startTime);
    const allResults = ipChecks.flatMap(check => check.results);
    const listedCount = allResults.filter(result => result.listed).length;
    const avgResponseTime = allResults.reduce((acc, curr) => acc + curr.responseTimeMs, 0) / allResults.length;
    const reliabilityScore = calculateReliabilityScore(allResults);

    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: totalSeconds * 1000 + totalNanoseconds / 1000000,
          averageResponseTimeMs: avgResponseTime,
          timestamp: new Date().toISOString()
        },
        summary: {
          totalIPs: aRecords.length,
          totalChecks: allResults.length,
          listedCount,
          reliabilityScore,
          riskLevel: calculateRiskLevel(listedCount, reliabilityScore)
        },
        relatedRecords: {
          a: aRecords,
          mx: mxRecords
        },
        ipDetails: ipChecks.map(check => ({
          ip: check.ip,
          networkInfo: check.networkInfo,
          results: check.results.sort((a, b) => b.reliability - a.reliability)
        }))
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = { checkDomain }; // Export as an object with named function
