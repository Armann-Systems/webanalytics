const express = require('express');
const router = express.Router();
const checkCertificate = require('./check');
const checkExpiry = require('./expiry');
const { domainValidator } = require('../../utils/validation');

/**
 * @openapi
 * tags:
 *   name: SSL
 *   description: SSL/TLS certificate validation and analysis
 */

/**
 * @openapi
 * /api/ssl/check:
 *   get:
 *     tags: [SSL]
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
 *                     infrastructure:
 *                       type: object
 *                       properties:
 *                         ipv4:
 *                           type: array
 *                           items:
 *                             type: string
 *                         ipv6:
 *                           type: array
 *                           items:
 *                             type: string
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           port:
 *                             type: number
 *                           subject:
 *                             type: object
 *                             properties:
 *                               CN:
 *                                 type: string
 *                           issuer:
 *                             type: object
 *                             properties:
 *                               O:
 *                                 type: string
 *                               CN:
 *                                 type: string
 *                           validFrom:
 *                             type: string
 *                             format: date-time
 *                           validTo:
 *                             type: string
 *                             format: date-time
 *                           daysRemaining:
 *                             type: number
 *                     tlsSupport:
 *                       type: object
 *                       properties:
 *                         protocols:
 *                           type: object
 *                           properties:
 *                             TLSv1.3:
 *                               type: boolean
 *                             TLSv1.2:
 *                               type: boolean
 *                             TLSv1.1:
 *                               type: boolean
 *                             TLSv1.0:
 *                               type: boolean
 *                         ciphers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               version:
 *                                 type: string
 *                               strength:
 *                                 type: string
 *                     security:
 *                       type: object
 *                       properties:
 *                         grade:
 *                           type: string
 *                         warnings:
 *                           type: array
 *                           items:
 *                             type: string
 *                         recommendations:
 *                           type: array
 *                           items:
 *                             type: string
 */
router.get('/check', domainValidator, checkCertificate);

/**
 * @openapi
 * /api/ssl/expiry:
 *   get:
 *     tags: [SSL]
 *     summary: Check SSL certificate expiry
 *     description: Get detailed information about SSL certificate expiration dates
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         schema:
 *           type: string
 *         description: Domain name to check certificate expiry
 *     responses:
 *       200:
 *         description: Successful expiry check
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
 *                     validFrom:
 *                       type: string
 *                       format: date-time
 *                     validTo:
 *                       type: string
 *                       format: date-time
 *                     daysRemaining:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [valid, expiring_soon, expired]
 *                     timeMs:
 *                       type: number
 */
router.get('/expiry', domainValidator, checkExpiry);

module.exports = router;
