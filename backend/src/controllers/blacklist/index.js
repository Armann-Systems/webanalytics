const express = require('express');
const router = express.Router();
const { domainValidator } = require('../../utils/validation');

/**
 * @openapi
 * tags:
 *   name: Blacklist
 *   description: IP and domain blacklist checking
 */

// Import the actual controller functions
const { checkDomain } = require('./domain');
const { checkIP } = require('./ip');

/**
 * @openapi
 * /api/blacklist/ip:
 *   get:
 *     tags: [Blacklist]
 *     summary: Check IP blacklist status
 *     description: Check if an IP address is listed in various blacklist databases
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: ip
 *         required: true
 *         schema:
 *           type: string
 *         description: IP address to check
 *     responses:
 *       200:
 *         description: Successful IP blacklist check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                     queryMetrics:
 *                       type: object
 *                       properties:
 *                         totalTimeMs:
 *                           type: number
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           provider:
 *                             type: string
 *                           listed:
 *                             type: boolean
 *                           listingReason:
 *                             type: string
 *                           timeMs:
 *                             type: number
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalLists:
 *                           type: number
 *                         listed:
 *                           type: number
 *                         notListed:
 *                           type: number
 *                         score:
 *                           type: number
 */
router.get('/ip', checkIP);

/**
 * @openapi
 * /api/blacklist/domain:
 *   get:
 *     tags: [Blacklist]
 *     summary: Check domain blacklist status
 *     description: Check if a domain is listed in various blacklist databases
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to check
 *     responses:
 *       200:
 *         description: Successful domain blacklist check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     domain:
 *                       type: string
 *                     queryMetrics:
 *                       type: object
 *                       properties:
 *                         totalTimeMs:
 *                           type: number
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           provider:
 *                             type: string
 *                           listed:
 *                             type: boolean
 *                           listingReason:
 *                             type: string
 *                           timeMs:
 *                             type: number
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalLists:
 *                           type: number
 *                         listed:
 *                           type: number
 *                         notListed:
 *                           type: number
 *                         score:
 *                           type: number
 *                     relatedRecords:
 *                       type: object
 *                       properties:
 *                         mx:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               priority:
 *                                 type: number
 *                               exchange:
 *                                 type: string
 *                         a:
 *                           type: array
 *                           items:
 *                             type: string
 */
router.get('/domain', domainValidator, checkDomain);

/**
 * @openapi
 * /api/blacklist/check:
 *   post:
 *     tags: [Blacklist]
 *     summary: Combined IP and domain check
 *     description: Check both IP and domain blacklist status in one request
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip:
 *                 type: string
 *                 description: IP address to check
 *               domain:
 *                 type: string
 *                 description: Domain name to check
 *     responses:
 *       200:
 *         description: Successful combined blacklist check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: object
 *                       $ref: '#/components/schemas/IPCheckResult'
 *                     domain:
 *                       type: object
 *                       $ref: '#/components/schemas/DomainCheckResult'
 *                     queryMetrics:
 *                       type: object
 *                       properties:
 *                         totalTimeMs:
 *                           type: number
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */
router.post('/check', async (req, res, next) => {
  try {
    const { ip, domain } = req.body;
    const startTime = process.hrtime();

    const results = await Promise.all([
      ip ? checkIP({ query: { ip } }, null, (e) => e) : null,
      domain ? checkDomain({ query: { domain } }, null, (e) => e) : null
    ]);

    const [seconds, nanoseconds] = process.hrtime(startTime);

    res.json({
      success: true,
      data: {
        ip: results[0],
        domain: results[1],
        queryMetrics: {
          totalTimeMs: seconds * 1000 + nanoseconds / 1000000,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
