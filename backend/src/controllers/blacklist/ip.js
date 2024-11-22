const { AppError } = require('../../middleware/errorHandler');
const dns = require('dns').promises;
const {
  DNSBL_PROVIDERS,
  calculateReliabilityScore,
  calculateRiskLevel,
  getNetworkInfo
} = require('./helpers');

/**
 * @openapi
 * components:
 *   schemas:
 *     BlacklistCheckResult:
 *       type: object
 *       properties:
 *         provider:
 *           type: string
 *           description: Name of the blacklist provider
 *         host:
 *           type: string
 *           description: Hostname of the blacklist provider
 *         description:
 *           type: string
 *           description: Description of the blacklist service
 *         reliability:
 *           type: number
 *           description: Reliability score of the provider
 *         listed:
 *           type: boolean
 *           description: Whether the IP is listed in this blacklist
 *         responseTimeMs:
 *           type: number
 *           description: Time taken to check this blacklist in milliseconds
 *         listingDetails:
 *           type: string
 *           description: Details about the listing if IP is blacklisted
 *         responseCode:
 *           type: string
 *           description: DNS response code received
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Time when the check was performed
 *         error:
 *           type: string
 *           description: Error code if the check failed
 */

/**
 * Check if an IP address is listed in various blacklist databases
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.ip - IP address to check
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} - Resolves when the check is complete
 * @throws {AppError} - Throws if IP format is invalid or check fails
 */
async function checkIP(req, res, next) {
  try {
    const { ip } = req.query; // Changed from req.params to req.query to match route definition
    const startTime = process.hrtime();
    
    // Validate IP format
    if (!ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      throw new AppError(400, 'Invalid IP address format');
    }

    // Reverse the IP for DNSBL lookup
    const reversedIp = ip.split('.').reverse().join('.');
    
    // Check each blacklist with detailed timing and response analysis
    const results = await Promise.all(
      DNSBL_PROVIDERS.map(async (provider) => {
        const checkStartTime = process.hrtime();
        try {
          const lookupAddress = `${reversedIp}.${provider.host}`;
          const records = await dns.resolve(lookupAddress);
          const [seconds, nanoseconds] = process.hrtime(checkStartTime);
          
          // Analyze the response code
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

    // Calculate overall metrics
    const [totalSeconds, totalNanoseconds] = process.hrtime(startTime);
    const listedCount = results.filter(result => result.listed).length;
    const avgResponseTime = results.reduce((acc, curr) => acc + curr.responseTimeMs, 0) / results.length;
    const reliabilityScore = calculateReliabilityScore(results);

    // Get geolocation and ISP information
    const networkInfo = await getNetworkInfo(ip);

    res.json({
      success: true,
      data: {
        ip,
        queryMetrics: {
          totalTimeMs: totalSeconds * 1000 + totalNanoseconds / 1000000,
          averageResponseTimeMs: avgResponseTime,
          timestamp: new Date().toISOString()
        },
        summary: {
          totalChecked: DNSBL_PROVIDERS.length,
          listedCount,
          reliabilityScore,
          riskLevel: calculateRiskLevel(listedCount, reliabilityScore)
        },
        networkInfo,
        results: results.sort((a, b) => b.reliability - a.reliability)
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = { checkIP }; // Export as an object with named function
