const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');
const authRoutes = require('./auth');
const apiKeyRoutes = require('./apiKeys');
const { authenticateApiKey, trackApiUsage, cacheResponse } = require('../middleware/apiAuth');
const db = require('../db');

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

// Import service routers first
const dnsRouter = require('../controllers/dns');
const smtpRouter = require('../controllers/smtp');
const sslRouter = require('../controllers/ssl');
const blacklistRouter = require('../controllers/blacklist');

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Check if the API is running
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * @openapi
 * /stats/public:
 *   get:
 *     tags: [System]
 *     summary: Public API statistics
 *     description: Get public usage statistics for the API
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 last24h:
 *                   type: object
 *                   properties:
 *                     activeKeys:
 *                       type: number
 *                       description: Number of active API keys
 *                     totalRequests:
 *                       type: number
 *                       description: Total number of requests
 *                     avgResponseTime:
 *                       type: number
 *                       description: Average response time in milliseconds
 */
router.get('/stats/public', async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(DISTINCT au.api_key_id) as active_keys,
                COUNT(*) as total_requests,
                AVG(au.response_time) as avg_response_time
            FROM api_usage au
            WHERE au.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        `);

        res.json({
            last24h: {
                activeKeys: stats.active_keys,
                totalRequests: stats.total_requests,
                avgResponseTime: Math.round(stats.avg_response_time || 0)
            }
        });
    } catch (error) {
        console.error('Error getting public stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// Authentication routes (no API key required)
router.use('/auth', authRoutes);

// API Key management routes (requires JWT auth)
router.use('/api-keys', apiKeyRoutes);

// Mount service endpoints before applying authentication
// This ensures Swagger can discover all routes
router.use('/dns', dnsRouter);           // DNS lookup and record checks
router.use('/smtp', smtpRouter);         // SMTP testing and diagnostics
router.use('/ssl', sslRouter);           // SSL certificate validation
router.use('/blacklist', blacklistRouter); // IP and domain blacklist checks

// API Management routes (requires JWT auth, handled in apiRoutes)
router.use('/manage', apiRoutes);

// Helper to check if path is an admin route
const isAdminRoute = (path) => {
    return path.startsWith('/auth/') || 
           path.startsWith('/api-keys/') || 
           path.startsWith('/manage/') ||
           path === '/health' ||
           path === '/stats/public';
};

// Apply API authentication and tracking middleware for all API endpoints
// Note: This middleware will not affect the Swagger UI or route discovery
const apiAuthMiddleware = [authenticateApiKey, trackApiUsage, cacheResponse];
router.use((req, res, next) => {
    // Skip middleware for OPTIONS requests (needed for Swagger)
    if (req.method === 'OPTIONS') {
        return next();
    }
    // Skip middleware for admin routes
    if (isAdminRoute(req.path)) {
        return next();
    }
    // Apply middleware chain
    return apiAuthMiddleware.reduce((promise, middleware) => {
        return promise.then(() => new Promise((resolve) => middleware(req, res, resolve)));
    }, Promise.resolve()).then(() => next()).catch(next);
});

/**
 * @openapi
 * components:
 *   responses:
 *     NotFound:
 *       description: Endpoint not found
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Endpoint not found
 *                 availableEndpoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["/auth/*", "/api-keys/*", "/dns/*", "/smtp/*", "/ssl/*", "/blacklist/*", "/manage/*", "/health", "/stats/public"]
 */
router.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            '/auth/*',
            '/api-keys/*',
            '/dns/*',
            '/smtp/*',
            '/ssl/*',
            '/blacklist/*',
            '/manage/*',
            '/health',
            '/stats/public'
        ]
    });
});

// Error handling middleware (should be last)
router.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;
