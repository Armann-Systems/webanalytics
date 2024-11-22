const { AppError } = require('../../middleware/errorHandler');
const dns = require('dns').promises;
const {
  getCertificateInfo,
  testTLSVersions,
  testCipherSuites,
  analyzeCertificateSecurity
} = require('./helpers');

/**
 * @openapi
 * /ssl/check:
 *   get:
 *     tags:
 *       - SSL
 *     summary: Check SSL/TLS configuration
 *     description: Performs comprehensive SSL/TLS analysis including certificate validation, protocol support, and cipher suites
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to check SSL configuration
 *     responses:
 *       200:
 *         description: Successful SSL check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     domain:
 *                       type: string
 *                       example: example.com
 *                     queryMetrics:
 *                       type: object
 *                       properties:
 *                         totalTimeMs:
 *                           type: number
 *                           example: 1234.56
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                     infrastructure:
 *                       type: object
 *                       properties:
 *                         ipv4:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "93.184.216.34"
 *                         ipv6:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "2606:2800:220:1:248:1893:25c8:1946"
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           port:
 *                             type: number
 *                             example: 443
 *                           subject:
 *                             type: object
 *                             properties:
 *                               CN:
 *                                 type: string
 *                                 example: "*.example.com"
 *                           issuer:
 *                             type: object
 *                             properties:
 *                               O:
 *                                 type: string
 *                                 example: "Let's Encrypt"
 *                               CN:
 *                                 type: string
 *                                 example: "R3"
 *                           validFrom:
 *                             type: string
 *                             format: date-time
 *                           validTo:
 *                             type: string
 *                             format: date-time
 *                           daysRemaining:
 *                             type: number
 *                             example: 85
 *                     tlsSupport:
 *                       type: object
 *                       properties:
 *                         protocols:
 *                           type: object
 *                           properties:
 *                             TLSv1.3:
 *                               type: boolean
 *                               example: true
 *                             TLSv1.2:
 *                               type: boolean
 *                               example: true
 *                             TLSv1.1:
 *                               type: boolean
 *                               example: false
 *                             TLSv1.0:
 *                               type: boolean
 *                               example: false
 *                         ciphers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "TLS_AES_256_GCM_SHA384"
 *                               version:
 *                                 type: string
 *                                 example: "TLSv1.3"
 *                               strength:
 *                                 type: string
 *                                 example: "strong"
 *                     security:
 *                       type: object
 *                       properties:
 *                         grade:
 *                           type: string
 *                           example: "A+"
 *                         warnings:
 *                           type: array
 *                           items:
 *                             type: string
 *                         recommendations:
 *                           type: array
 *                           items:
 *                             type: string
 *       400:
 *         description: Invalid domain name
 *       401:
 *         description: Invalid or missing API key
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
async function checkCertificate(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();

    // Get all relevant DNS records
    const [aRecords, aaaaRecords] = await Promise.all([
      dns.resolve4(domain).catch(() => []),
      dns.resolve6(domain).catch(() => [])
    ]);

    // Test SSL on different ports
    const ports = [443, 465, 993, 995, 8443];
    const portTests = await Promise.all(
      ports.map(async (port) => {
        try {
          const certInfo = await getCertificateInfo(domain, port);
          return {
            port,
            ...certInfo
          };
        } catch (error) {
          return {
            port,
            error: error.message
          };
        }
      })
    );

    // Test TLS protocol support
    const protocolSupport = await testTLSVersions(domain);
    
    // Test cipher suite support
    const cipherSupport = await testCipherSuites(domain);

    // Analyze certificate security
    const securityAnalysis = analyzeCertificateSecurity(portTests[0]); // Analysis of main HTTPS cert

    const [totalSeconds, totalNanoseconds] = process.hrtime(startTime);

    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: totalSeconds * 1000 + totalNanoseconds / 1000000,
          timestamp: new Date().toISOString()
        },
        infrastructure: {
          ipv4: aRecords,
          ipv6: aaaaRecords
        },
        certificates: portTests,
        tlsSupport: {
          protocols: protocolSupport,
          ciphers: cipherSupport
        },
        security: securityAnalysis
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = checkCertificate;
