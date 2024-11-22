const { AppError } = require('../../middleware/errorHandler');
const { Resolver } = require('dns').promises;
const dns = require('dns').promises;
const {
  performTimedDNSQuery,
  identifyDNSProvider,
  checkDNSPropagation,
  checkDNSSEC
} = require('./helpers');

/**
 * @openapi
 * /dns/lookup:
 *   get:
 *     tags:
 *       - DNS
 *     summary: Comprehensive DNS lookup
 *     description: Performs a detailed DNS lookup including A, AAAA, MX, TXT, NS, SOA, and CNAME records, nameserver performance, propagation status, and DNSSEC information
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to lookup
 *     responses:
 *       200:
 *         description: Successful DNS lookup
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
 *                           example: 245.67
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                         nameserverPerformance:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               nameserver:
 *                                 type: string
 *                               ip:
 *                                 type: string
 *                               responseTime:
 *                                 type: number
 *                               status:
 *                                 type: string
 *                               provider:
 *                                 type: string
 *                     records:
 *                       type: object
 *                       properties:
 *                         a:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             timeMs:
 *                               type: number
 *                         aaaa:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             timeMs:
 *                               type: number
 *                         txt:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                             timeMs:
 *                               type: number
 *                         mx:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   priority:
 *                                     type: number
 *                                   exchange:
 *                                     type: string
 *                             timeMs:
 *                               type: number
 *                         ns:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             timeMs:
 *                               type: number
 *                         soa:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   nsname:
 *                                     type: string
 *                                   hostmaster:
 *                                     type: string
 *                                   serial:
 *                                     type: number
 *                                   refresh:
 *                                     type: number
 *                                   retry:
 *                                     type: number
 *                                   expire:
 *                                     type: number
 *                                   minttl:
 *                                     type: number
 *                             timeMs:
 *                               type: number
 *                         cname:
 *                           type: object
 *                           properties:
 *                             records:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             timeMs:
 *                               type: number
 *                     propagation:
 *                       type: object
 *                       properties:
 *                         providers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               provider:
 *                                 type: string
 *                               status:
 *                                 type: string
 *                               timeMs:
 *                                 type: number
 *                     authoritativeNameservers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           nameserver:
 *                             type: string
 *                           ip:
 *                             type: string
 *                           responseTime:
 *                             type: number
 *                           status:
 *                             type: string
 *                           provider:
 *                             type: string
 *                     dnssec:
 *                       type: object
 *                       properties:
 *                         enabled:
 *                           type: boolean
 *                         valid:
 *                           type: boolean
 *       400:
 *         description: Invalid domain name
 *       401:
 *         description: Invalid or missing API key
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
async function lookup(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();
    
    // Create resolver for initial NS lookup
    const mainResolver = new Resolver();
    
    // Get authoritative nameservers
    const nsRecords = await performTimedDNSQuery(mainResolver, domain, 'NS');
    
    // Test each nameserver with its own resolver instance
    const nameserverTests = await Promise.all(
      (nsRecords.records || []).map(async (ns) => {
        const nsStartTime = process.hrtime();
        try {
          // Resolve nameserver hostname to IP
          const nsIps = await dns.resolve4(ns);
          if (!nsIps || nsIps.length === 0) {
            throw new Error('Could not resolve nameserver IP');
          }
          
          // Create a new resolver instance for this nameserver
          const nsResolver = new Resolver();
          nsResolver.setServers([nsIps[0]]);
          
          await nsResolver.resolve4(domain);
          const [seconds, nanoseconds] = process.hrtime(nsStartTime);
          return {
            nameserver: ns,
            ip: nsIps[0],
            responseTime: seconds * 1000 + nanoseconds / 1000000,
            status: 'operational',
            provider: identifyDNSProvider(ns)
          };
        } catch (error) {
          return {
            nameserver: ns,
            ip: error.ip,
            status: 'error',
            error: error.message,
            provider: identifyDNSProvider(ns)
          };
        }
      })
    );

    // Create a fresh resolver for remaining queries
    const queryResolver = new Resolver();
    queryResolver.setServers(['8.8.8.8', '1.1.1.1']);

    // Parallel DNS queries for comprehensive information
    const [
      aRecords,
      aaaaRecords,
      txtRecords,
      mxRecords,
      nsRecords2,
      soaRecord,
      cnameRecords
    ] = await Promise.all([
      performTimedDNSQuery(queryResolver, domain, 'A'),
      performTimedDNSQuery(queryResolver, domain, 'AAAA'),
      performTimedDNSQuery(queryResolver, domain, 'TXT'),
      performTimedDNSQuery(queryResolver, domain, 'MX'),
      performTimedDNSQuery(queryResolver, domain, 'NS'),
      performTimedDNSQuery(queryResolver, domain, 'SOA'),
      performTimedDNSQuery(queryResolver, domain, 'CNAME')
    ]);

    // Get propagation status across major DNS providers
    const propagationChecks = await checkDNSPropagation(domain);

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const totalTime = seconds * 1000 + nanoseconds / 1000000;

    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: totalTime,
          timestamp: new Date().toISOString(),
          nameserverPerformance: nameserverTests
        },
        records: {
          a: aRecords,
          aaaa: aaaaRecords,
          txt: txtRecords,
          mx: mxRecords,
          ns: nsRecords2,
          soa: soaRecord,
          cname: cnameRecords
        },
        propagation: propagationChecks,
        authoritativeNameservers: nameserverTests,
        dnssec: await checkDNSSEC(domain)
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = lookup;
