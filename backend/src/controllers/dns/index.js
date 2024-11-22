const express = require('express');
const router = express.Router();
const lookup = require('./lookup');
const getMXRecords = require('./mx');
const getTXTRecords = require('./txt');
const getSPFRecords = require('./spf');
const getDMARCRecords = require('./dmarc');
const { domainValidator } = require('../../utils/validation');

/**
 * @openapi
 * tags:
 *   name: DNS
 *   description: DNS lookup and record operations
 */

/**
 * @openapi
 * /api/dns/lookup:
 *   get:
 *     tags: [DNS]
 *     summary: Comprehensive DNS lookup
 *     description: Performs a detailed DNS lookup including A, AAAA, MX, TXT, NS, SOA, and CNAME records
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
 */
router.get('/lookup', domainValidator, lookup);

/**
 * @openapi
 * /api/dns/mx:
 *   get:
 *     tags: [DNS]
 *     summary: MX records lookup
 *     description: Get MX (Mail Exchange) records for a domain
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to lookup MX records
 *     responses:
 *       200:
 *         description: Successful MX records lookup
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
 *                     records:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           priority:
 *                             type: number
 *                           exchange:
 *                             type: string
 *                     timeMs:
 *                       type: number
 */
router.get('/mx', domainValidator, getMXRecords);

/**
 * @openapi
 * /api/dns/txt:
 *   get:
 *     tags: [DNS]
 *     summary: TXT records lookup
 *     description: Get TXT records for a domain
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to lookup TXT records
 *     responses:
 *       200:
 *         description: Successful TXT records lookup
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
 *                     records:
 *                       type: array
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                     timeMs:
 *                       type: number
 */
router.get('/txt', domainValidator, getTXTRecords);

/**
 * @openapi
 * /api/dns/spf:
 *   get:
 *     tags: [DNS]
 *     summary: SPF record lookup
 *     description: Get SPF (Sender Policy Framework) record for a domain
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to lookup SPF record
 *     responses:
 *       200:
 *         description: Successful SPF record lookup
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
 *                     record:
 *                       type: string
 *                     parsed:
 *                       type: object
 *                       properties:
 *                         version:
 *                           type: string
 *                         mechanisms:
 *                           type: array
 *                           items:
 *                             type: string
 *                     timeMs:
 *                       type: number
 */
router.get('/spf', domainValidator, getSPFRecords);

/**
 * @openapi
 * /api/dns/dmarc:
 *   get:
 *     tags: [DNS]
 *     summary: DMARC record lookup
 *     description: Get DMARC (Domain-based Message Authentication, Reporting & Conformance) record for a domain
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to lookup DMARC record
 *     responses:
 *       200:
 *         description: Successful DMARC record lookup
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
 *                     record:
 *                       type: string
 *                     parsed:
 *                       type: object
 *                       properties:
 *                         version:
 *                           type: string
 *                         policy:
 *                           type: string
 *                         subdomainPolicy:
 *                           type: string
 *                         percentage:
 *                           type: number
 *                         reportingEmails:
 *                           type: array
 *                           items:
 *                             type: string
 *                     timeMs:
 *                       type: number
 */
router.get('/dmarc', domainValidator, getDMARCRecords);

module.exports = router;
