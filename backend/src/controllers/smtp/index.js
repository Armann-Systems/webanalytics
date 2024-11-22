const express = require('express');
const router = express.Router();
const testSmtp = require('./test');
const getDiagnostics = require('./diagnostics');
const { domainValidator } = require('../../utils/validation');

/**
 * @openapi
 * tags:
 *   name: SMTP
 *   description: SMTP server testing and diagnostics
 */

/**
 * @openapi
 * /smtp/test:
 *   post:
 *     tags: [SMTP]
 *     summary: Test SMTP server
 *     description: Test SMTP server configuration and connectivity
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domain
 *             properties:
 *               domain:
 *                 type: string
 *                 description: Domain to test SMTP configuration
 *               port:
 *                 type: number
 *                 description: SMTP port to test (default 25)
 *               timeout:
 *                 type: number
 *                 description: Connection timeout in milliseconds (default 5000)
 *     responses:
 *       200:
 *         description: Successful SMTP test
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
 *                     connection:
 *                       type: object
 *                       properties:
 *                         established:
 *                           type: boolean
 *                         timeMs:
 *                           type: number
 *                         banner:
 *                           type: string
 *                     features:
 *                       type: object
 *                       properties:
 *                         starttls:
 *                           type: boolean
 *                         auth:
 *                           type: array
 *                           items:
 *                             type: string
 *                         size:
 *                           type: number
 *                     security:
 *                       type: object
 *                       properties:
 *                         tls:
 *                           type: boolean
 *                         version:
 *                           type: string
 *                         cipher:
 *                           type: string
 */
router.post('/test', domainValidator, testSmtp);

/**
 * @openapi
 * /smtp/diagnostics:
 *   get:
 *     tags: [SMTP]
 *     summary: Get SMTP diagnostics
 *     description: Get comprehensive SMTP server diagnostics including DNS records, connectivity, and security
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain to get SMTP diagnostics
 *     responses:
 *       200:
 *         description: Successful SMTP diagnostics
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
 *                     records:
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
 *                         spf:
 *                           type: object
 *                           properties:
 *                             record:
 *                               type: string
 *                             valid:
 *                               type: boolean
 *                         dmarc:
 *                           type: object
 *                           properties:
 *                             record:
 *                               type: string
 *                             valid:
 *                               type: boolean
 *                     servers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           hostname:
 *                             type: string
 *                           ip:
 *                             type: string
 *                           port:
 *                             type: number
 *                           banner:
 *                             type: string
 *                           features:
 *                             type: object
 *                             properties:
 *                               starttls:
 *                                 type: boolean
 *                               auth:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                           security:
 *                             type: object
 *                             properties:
 *                               tls:
 *                                 type: boolean
 *                               version:
 *                                 type: string
 *                               cipher:
 *                                 type: string
 */
router.get('/diagnostics', domainValidator, getDiagnostics);

module.exports = router;
