const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const apiKeyCache = require('../services/apiKeyCache');
const db = require('../db');

// Cache for API responses (1 minute TTL)
const responseCache = new NodeCache({ stdTTL: 60 });

// Helper to get real IP address behind reverse proxy
const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
};

// Helper to check if request should bypass cache
const shouldBypassCache = (req) => {
    return req.user?.canBypassCache && req.headers['x-bypass-cache'] === 'true';
};

// Helper to generate cache key
const getCacheKey = (req) => {
    return `${req.method}:${req.originalUrl}:${JSON.stringify(req.body)}`;
};

// Helper to format reset time
const formatResetTime = (resetTime) => {
    const now = new Date();
    const reset = new Date(resetTime);
    const diffMinutes = Math.ceil((reset - now) / (1000 * 60));
    
    if (diffMinutes < 60) {
        return `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else {
        const diffHours = Math.ceil(diffMinutes / 60);
        return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
};

// Service endpoints rate limiter for website users (IP-based)
const serviceRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute (matching free plan)
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => getClientIp(req),
    handler: (req, res) => {
        // Calculate reset time based on the current window start
        const windowStart = Math.floor(Date.now() / (60 * 1000)) * (60 * 1000);
        const resetTime = new Date(windowStart + (60 * 1000));
        
        res.status(429).json({
            error: 'Rate limit exceeded (10 requests per minute)',
            limit_type: 'rpm',
            reset: resetTime,
            message: `Rate limit of 10 requests per minute exceeded. Limit resets ${formatResetTime(resetTime)}.`
        });
    }
});

// Helper to check if path is an admin route
const isAdminRoute = (path) => {
    return path.startsWith('/auth/') || 
           path.startsWith('/api-keys/') || 
           path.startsWith('/manage/');
};

// Middleware to authenticate API key
const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const clientIp = getClientIp(req);

    // Skip rate limiting for admin routes
    if (isAdminRoute(req.path)) {
        req.user = {
            type: 'website',
            ip: clientIp,
            plan: 'FREE',
            canBypassCache: false
        };
        return next();
    }

    // Handle website users (no API key)
    if (!apiKey) {
        req.user = {
            type: 'website',
            ip: clientIp,
            plan: 'FREE',
            canBypassCache: false
        };
        // Apply rate limiting for all service endpoints
        return serviceRateLimiter(req, res, next);
    }

    // Get API key details from cache
    let keyDetails = apiKeyCache.getKey(apiKey);

    // If not in cache, try to load it
    if (!keyDetails) {
        keyDetails = await apiKeyCache.updateKey(apiKey);
        if (!keyDetails) {
            return res.status(401).json({ error: 'Invalid API key' });
        }
    }

    // Check rate limit for all service endpoints
    const rateLimitResult = apiKeyCache.checkRateLimit(
        keyDetails.keyId,
        keyDetails.limits.perMinute
    );

    // Add rate limit info to response headers
    res.setHeader('X-RateLimit-Limit', rateLimitResult.limit);
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimitResult.reset);

    if (!rateLimitResult.allowed) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            reset: new Date(rateLimitResult.reset),
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining
        });
    }

    // Attach user info to request
    req.user = {
        type: 'api',
        ...keyDetails
    };

    next();
};

// Queue for batching usage tracking
let usageQueue = [];
const BATCH_SIZE = 100;
const FLUSH_INTERVAL = 10000; // 10 seconds

// Debug helper for usage queue
const logUsageQueueStatus = () => {
    console.log(`[Usage Queue] Current queue size: ${usageQueue.length}`);
};

// Periodically flush the usage queue
setInterval(() => {
    if (usageQueue.length > 0) {
        console.log(`[Usage Queue] Initiating periodic flush with ${usageQueue.length} items`);
        const batch = usageQueue.splice(0, usageQueue.length);
        flushUsageQueue(batch).catch(err => {
            console.error('[Usage Queue] Periodic flush error:', err);
            // Put items back in queue if flush failed
            usageQueue.unshift(...batch);
            console.log('[Usage Queue] Items returned to queue after failed flush');
        });
    }
}, FLUSH_INTERVAL);

// Helper to flush usage queue to database
async function flushUsageQueue(batch) {
    if (batch.length === 0) return;

    console.log(`[Usage Queue] Attempting to flush ${batch.length} items to database`);
    
    try {
        // Verify database connection
        await db.query('SELECT 1');
        console.log('[Usage Queue] Database connection verified');

        // Create placeholders for each row
        const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
        
        // Flatten the values array
        const values = batch.flatMap(usage => [
            usage.keyId,
            usage.endpoint,
            usage.responseTime,
            usage.statusCode,
            usage.ip,
            usage.userAgent
        ]);

        console.log('[Usage Queue] Executing insert query with values:', {
            batchSize: batch.length,
            firstKeyId: values[0],
            firstEndpoint: values[1]
        });

        const result = await db.query(`
            INSERT INTO api_usage 
            (api_key_id, endpoint, response_time, status_code, ip_address, user_agent)
            VALUES ${placeholders}
        `, values);

        console.log(`[Usage Queue] Successfully inserted ${batch.length} records. Result:`, {
            affectedRows: result.affectedRows,
            insertId: result.insertId
        });

    } catch (error) {
        console.error('[Usage Queue] Detailed error in flushUsageQueue:', {
            error: error.message,
            code: error.code,
            sqlState: error.sqlState,
            stack: error.stack
        });
        throw error; // Re-throw to handle in the caller
    }
}

// Middleware to track API usage
const trackApiUsage = (req, res, next) => {
    if (req.user?.type !== 'api') {
        return next();
    }

    const startTime = Date.now();
    const clientIp = getClientIp(req);

    // Store the original end function
    const originalEnd = res.end;

    // Override the end function
    res.end = function (chunk, encoding) {
        // Calculate response time
        const responseTime = Date.now() - startTime;

        // Add to usage queue
        usageQueue.push({
            keyId: req.user.keyId,
            endpoint: req.originalUrl,
            responseTime,
            statusCode: res.statusCode,
            ip: clientIp,
            userAgent: req.headers['user-agent']
        });

        console.log('[Usage Queue] Added new usage record:', {
            keyId: req.user.keyId,
            endpoint: req.originalUrl,
            queueSize: usageQueue.length
        });

        // Flush queue if it reaches batch size
        if (usageQueue.length >= BATCH_SIZE) {
            console.log('[Usage Queue] Queue reached batch size, initiating flush');
            const batch = usageQueue.splice(0, BATCH_SIZE);
            flushUsageQueue(batch).catch(err => {
                console.error('[Usage Queue] Batch flush error:', err);
                // Put items back in queue if flush failed
                usageQueue.unshift(...batch);
                console.log('[Usage Queue] Items returned to queue after failed flush');
            });
        }

        // Call the original end function
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

// Middleware to handle response caching
const cacheResponse = (req, res, next) => {
    if (req.method !== 'GET' || shouldBypassCache(req)) {
        return next();
    }

    const key = getCacheKey(req);
    const cachedResponse = responseCache.get(key);

    if (cachedResponse) {
        // Add cache status header
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedResponse);
    }

    // Add cache status header
    res.setHeader('X-Cache', 'MISS');

    // Store the original json function
    const originalJson = res.json;

    // Override the json function
    res.json = function (data) {
        responseCache.set(key, data);
        originalJson.call(this, data);
    };

    next();
};

module.exports = {
    authenticateApiKey,
    trackApiUsage,
    cacheResponse
};
