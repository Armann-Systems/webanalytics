const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../db');
const apiKeyCache = require('../services/apiKeyCache');

// Helper to generate a secure API key
function generateApiKey() {
    return crypto
        .randomBytes(32)
        .toString('base64')
        .replace(/[/+=]/g, '')
        .substring(0, 32);
}

// Helper to check if user is admin/staff
function isAdminOrStaff(role) {
    return ['admin', 'staff'].includes(role);
}

const apiController = {
    // Create a new API key for a customer
    async createApiKey(req, res) {
        const { customerId, name, expiresAt } = req.body;
        const createdBy = req.user.userId;

        try {
            // Only admin/staff can create keys for other customers
            if (!isAdminOrStaff(req.user.role) && req.user.userId !== customerId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const apiKey = generateApiKey();

            const [result] = await db.query(`
                INSERT INTO api_keys (customer_id, api_key, name, expires_at, created_by)
                VALUES (?, ?, ?, ?, ?)
            `, [customerId, apiKey, name, expiresAt || null, createdBy]);

            // Update cache
            await apiKeyCache.updateKey(apiKey);

            res.json({
                id: result.insertId,
                apiKey,
                name,
                expiresAt
            });
        } catch (error) {
            console.error('Error creating API key:', error);
            res.status(500).json({ error: 'Failed to create API key' });
        }
    },

    // List API keys for a customer
    async listApiKeys(req, res) {
        const { customerId } = req.params;

        try {
            // Only admin/staff can view other customers' keys
            if (!isAdminOrStaff(req.user.role) && req.user.userId !== parseInt(customerId)) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const keys = await db.query(`
                SELECT 
                    ak.id,
                    ak.name,
                    ak.api_key,
                    ak.is_active,
                    ak.expires_at,
                    ak.created_at,
                    u.email as created_by_email
                FROM api_keys ak
                JOIN users u ON ak.created_by = u.id
                WHERE ak.customer_id = ?
                ORDER BY ak.created_at DESC
            `, [customerId]);

            res.json(keys);
        } catch (error) {
            console.error('Error listing API keys:', error);
            res.status(500).json({ error: 'Failed to list API keys' });
        }
    },

    // Revoke an API key
    async revokeApiKey(req, res) {
        const { keyId } = req.params;

        try {
            const [key] = await db.query(
                'SELECT customer_id, api_key FROM api_keys WHERE id = ?',
                [keyId]
            );

            // Only admin/staff or key owner can revoke
            if (!isAdminOrStaff(req.user.role) && req.user.userId !== key.customer_id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await db.query(
                'UPDATE api_keys SET is_active = false WHERE id = ?',
                [keyId]
            );

            // Remove from cache
            apiKeyCache.removeKey(key.api_key);

            res.json({ message: 'API key revoked successfully' });
        } catch (error) {
            console.error('Error revoking API key:', error);
            res.status(500).json({ error: 'Failed to revoke API key' });
        }
    },

    // Get API key usage statistics
    async getKeyUsage(req, res) {
        const { keyId } = req.params;
        const { period = 'day', start, end } = req.query;

        try {
            // Get key and customer info
            const [[key]] = await db.query(`
                SELECT ak.customer_id, ak.api_key, cs.plan_id
                FROM api_keys ak
                JOIN customer_subscriptions cs ON cs.customer_id = ak.customer_id
                WHERE ak.id = ? AND cs.is_active = true
            `, [keyId]);

            // Only admin/staff or key owner can view usage
            if (!isAdminOrStaff(req.user.role) && req.user.userId !== key.customer_id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Get plan limits
            const [[limits]] = await db.query(`
                SELECT 
                    MAX(CASE WHEN limit_type = 'per_day' THEN limit_value END) as daily_limit,
                    MAX(CASE WHEN limit_type = 'per_month' THEN limit_value END) as monthly_limit
                FROM api_limits
                WHERE plan_id = ?
            `, [key.plan_id]);

            // Get usage aggregates
            const [usage] = await db.query(`
                SELECT 
                    DATE_FORMAT(period_start, '%Y-%m-%d %H:%i') as period,
                    request_count,
                    period_type
                FROM api_usage_aggregates
                WHERE api_key_id = ?
                AND period_type IN ('minute', 'day', 'month')
                AND period_start BETWEEN ? AND ?
                ORDER BY period_start ASC
            `, [keyId, start, end]);

            // Get endpoint usage breakdown
            const [endpointUsage] = await db.query(`
                SELECT 
                    endpoint,
                    COUNT(*) as request_count,
                    AVG(response_time) as avg_response_time,
                    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
                FROM api_usage
                WHERE api_key_id = ?
                AND timestamp BETWEEN ? AND ?
                GROUP BY endpoint
                ORDER BY request_count DESC
            `, [keyId, start, end]);

            // Calculate error rates and response times
            const [metrics] = await db.query(`
                SELECT 
                    COUNT(*) as total_requests,
                    AVG(response_time) as avg_response_time,
                    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as total_errors
                FROM api_usage
                WHERE api_key_id = ?
                AND timestamp BETWEEN ? AND ?
            `, [keyId, start, end]);

            res.json({
                limits: {
                    daily: limits.daily_limit,
                    monthly: limits.monthly_limit
                },
                usage: {
                    byPeriod: usage,
                    byEndpoint: endpointUsage
                },
                metrics: {
                    totalRequests: metrics[0].total_requests,
                    avgResponseTime: Math.round(metrics[0].avg_response_time || 0),
                    errorRate: metrics[0].total_requests ? 
                        (metrics[0].total_errors / metrics[0].total_requests * 100).toFixed(2) : 0
                }
            });
        } catch (error) {
            console.error('Error getting API key usage:', error);
            res.status(500).json({ error: 'Failed to get API key usage' });
        }
    },

    // Create a custom plan
    async createCustomPlan(req, res) {
        const { name, description, limits } = req.body;
        const createdBy = req.user.userId;

        try {
            // Only admin/staff can create custom plans
            if (!isAdminOrStaff(req.user.role)) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const [plan] = await db.query(`
                INSERT INTO api_plans (name, description, is_custom, created_by)
                VALUES (?, ?, true, ?)
            `, [name, description, createdBy]);

            // Insert limits
            const limitPromises = Object.entries(limits).map(([type, value]) =>
                db.query(`
                    INSERT INTO api_limits (plan_id, limit_type, limit_value, can_bypass_cache)
                    VALUES (?, ?, ?, ?)
                `, [plan.insertId, type, value, true])
            );

            await Promise.all(limitPromises);

            res.json({
                id: plan.insertId,
                name,
                description,
                limits
            });
        } catch (error) {
            console.error('Error creating custom plan:', error);
            res.status(500).json({ error: 'Failed to create custom plan' });
        }
    },

    // Assign plan to customer
    async assignPlan(req, res) {
        const { customerId, planId, startsAt, endsAt } = req.body;
        const createdBy = req.user.userId;

        try {
            // Only admin/staff can assign plans
            if (!isAdminOrStaff(req.user.role)) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            // Deactivate current subscription if exists
            await db.query(`
                UPDATE customer_subscriptions 
                SET is_active = false 
                WHERE customer_id = ? AND is_active = true
            `, [customerId]);

            // Create new subscription
            const [subscription] = await db.query(`
                INSERT INTO customer_subscriptions 
                (customer_id, plan_id, starts_at, ends_at, created_by)
                VALUES (?, ?, ?, ?, ?)
            `, [customerId, planId, startsAt || new Date(), endsAt, createdBy]);

            // Refresh cache for customer's API keys
            const keys = await db.query(
                'SELECT api_key FROM api_keys WHERE customer_id = ? AND is_active = true',
                [customerId]
            );
            
            for (const key of keys) {
                await apiKeyCache.updateKey(key.api_key);
            }

            res.json({
                id: subscription.insertId,
                customerId,
                planId,
                startsAt,
                endsAt
            });
        } catch (error) {
            console.error('Error assigning plan:', error);
            res.status(500).json({ error: 'Failed to assign plan' });
        }
    }
};

module.exports = apiController;
