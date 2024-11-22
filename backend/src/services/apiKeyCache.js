const NodeCache = require('node-cache');
const db = require('../db'); // We'll create this later

// Cache with 5 minute TTL by default
const apiKeyCache = new NodeCache({ stdTTL: 300 });

// Cache for rate limiting with 1 minute TTL
const rateLimitCache = new NodeCache({ stdTTL: 60 });

class ApiKeyCache {
    constructor() {
        // Start periodic sync
        this.startPeriodicSync();
    }

    // Load all active API keys into cache
    async loadAllKeys() {
        try {
            const keys = await db.query(`
                SELECT 
                    ak.api_key,
                    ak.id as key_id,
                    ak.customer_id,
                    ak.is_active,
                    ak.expires_at,
                    cs.plan_id,
                    ap.name as plan_name,
                    al.limit_value,
                    al.can_bypass_cache
                FROM api_keys ak
                JOIN customer_subscriptions cs ON ak.customer_id = cs.customer_id
                JOIN api_plans ap ON cs.plan_id = ap.id
                JOIN api_limits al ON ap.id = al.plan_id
                WHERE ak.is_active = true
                AND (ak.expires_at IS NULL OR ak.expires_at > NOW())
                AND cs.is_active = true
                AND (cs.ends_at IS NULL OR cs.ends_at > NOW())
                AND al.limit_type = 'per_minute'
            `);

            // Store in cache
            keys.forEach(key => {
                const cacheData = {
                    keyId: key.key_id,
                    customerId: key.customer_id,
                    plan: key.plan_name,
                    canBypassCache: key.can_bypass_cache,
                    limits: {
                        perMinute: key.limit_value
                    }
                };
                apiKeyCache.set(key.api_key, cacheData);
            });

            console.log(`Loaded ${keys.length} API keys into cache`);
        } catch (error) {
            console.error('Error loading API keys into cache:', error);
        }
    }

    // Get key details from cache
    getKey(apiKey) {
        return apiKeyCache.get(apiKey);
    }

    // Update single key in cache
    async updateKey(apiKey) {
        try {
            const [key] = await db.query(`
                SELECT 
                    ak.id as key_id,
                    ak.customer_id,
                    ak.is_active,
                    ak.expires_at,
                    cs.plan_id,
                    ap.name as plan_name,
                    al.limit_value,
                    al.can_bypass_cache
                FROM api_keys ak
                JOIN customer_subscriptions cs ON ak.customer_id = cs.customer_id
                JOIN api_plans ap ON cs.plan_id = ap.id
                JOIN api_limits al ON ap.id = al.plan_id
                WHERE ak.api_key = ? 
                AND ak.is_active = true
                AND (ak.expires_at IS NULL OR ak.expires_at > NOW())
                AND cs.is_active = true
                AND (cs.ends_at IS NULL OR cs.ends_at > NOW())
                AND al.limit_type = 'per_minute'
            `, [apiKey]);

            if (key) {
                const cacheData = {
                    keyId: key.key_id,
                    customerId: key.customer_id,
                    plan: key.plan_name,
                    canBypassCache: key.can_bypass_cache,
                    limits: {
                        perMinute: key.limit_value
                    }
                };
                apiKeyCache.set(apiKey, cacheData);
                return cacheData;
            }
            
            // If key not found or inactive, remove from cache
            apiKeyCache.del(apiKey);
            return null;
        } catch (error) {
            console.error('Error updating API key in cache:', error);
            return null;
        }
    }

    // Check rate limit
    checkRateLimit(keyId, limit) {
        const cacheKey = `ratelimit:${keyId}`;
        let usage = rateLimitCache.get(cacheKey);

        if (!usage) {
            usage = { count: 0, reset: Date.now() + 60000 }; // 1 minute window
        }

        if (usage.count >= limit) {
            return {
                allowed: false,
                reset: usage.reset,
                limit,
                remaining: 0
            };
        }

        usage.count++;
        rateLimitCache.set(cacheKey, usage);

        return {
            allowed: true,
            reset: usage.reset,
            limit,
            remaining: limit - usage.count
        };
    }

    // Start periodic sync with database
    startPeriodicSync() {
        // Sync every 5 minutes
        setInterval(() => {
            this.loadAllKeys();
        }, 5 * 60 * 1000);
    }
}

// Export singleton instance
module.exports = new ApiKeyCache();
