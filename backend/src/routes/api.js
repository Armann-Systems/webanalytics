const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const jwt = require('jsonwebtoken');

/**
 * @openapi
 * tags:
 *   name: API Management
 *   description: API key and plan management endpoints
 */

// Middleware to verify JWT token for admin routes
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to ensure admin/staff role
const requireAdmin = (req, res, next) => {
    if (!['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Requires admin privileges' });
    }
    next();
};

/**
 * @openapi
 * /api/manage/keys:
 *   post:
 *     tags: [API Management]
 *     summary: Create new API key
 *     description: Create a new API key for a customer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Customer ID to create key for
 *     responses:
 *       201:
 *         description: API key created successfully
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
 *                     apiKey:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 */
router.post('/keys', verifyToken, apiController.createApiKey);

/**
 * @openapi
 * /api/manage/keys/customer/{customerId}:
 *   get:
 *     tags: [API Management]
 *     summary: List customer API keys
 *     description: Get all API keys for a specific customer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API keys retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       lastUsed:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 */
router.get('/keys/customer/:customerId', verifyToken, apiController.listApiKeys);

/**
 * @openapi
 * /api/manage/keys/{keyId}:
 *   delete:
 *     tags: [API Management]
 *     summary: Revoke API key
 *     description: Revoke an existing API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key revoked successfully
 */
router.delete('/keys/:keyId', verifyToken, apiController.revokeApiKey);

/**
 * @openapi
 * /api/manage/keys/{keyId}/usage:
 *   get:
 *     tags: [API Management]
 *     summary: Get API key usage
 *     description: Get usage statistics for a specific API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usage statistics retrieved successfully
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
 *                     totalRequests:
 *                       type: number
 *                     avgResponseTime:
 *                       type: number
 *                     errorRate:
 *                       type: number
 *                     usageByEndpoint:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 */
router.get('/keys/:keyId/usage', verifyToken, apiController.getKeyUsage);

/**
 * @openapi
 * /api/manage/plans:
 *   post:
 *     tags: [API Management]
 *     summary: Create custom plan
 *     description: Create a new custom plan (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - limits
 *             properties:
 *               name:
 *                 type: string
 *               limits:
 *                 type: object
 *                 properties:
 *                   requestsPerDay:
 *                     type: number
 *                   requestsPerMonth:
 *                     type: number
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
router.post('/plans', verifyToken, requireAdmin, apiController.createCustomPlan);

/**
 * @openapi
 * /api/manage/plans/assign:
 *   post:
 *     tags: [API Management]
 *     summary: Assign plan to customer
 *     description: Assign a plan to a customer (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - planId
 *             properties:
 *               customerId:
 *                 type: string
 *               planId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan assigned successfully
 */
router.post('/plans/assign', verifyToken, requireAdmin, apiController.assignPlan);

module.exports = router;
