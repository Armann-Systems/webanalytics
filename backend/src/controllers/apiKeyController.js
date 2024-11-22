const crypto = require('crypto');
const db = require('../db');

const generateApiKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const getCountFromResult = (result) => {
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0]) {
        return 0;
    }
    return result[0].count || 0;
};

const getApiKeys = async (req, res) => {
    console.log('getApiKeys called with userId:', req.user.userId);
    
    try {
        const userId = req.user.userId;
        const profiles = await db.query(
            'SELECT id FROM customer_profiles WHERE user_id = ?',
            [userId]
        );

        console.log('Found profiles:', JSON.stringify(profiles, null, 2));

        if (!profiles || profiles.length === 0 || !profiles[0] || !profiles[0].id) {
            console.log('No customer profile found for userId:', userId);
            return res.status(404).json({ error: 'Kundenprofil nicht gefunden' });
        }

        const customerId = profiles[0].id;
        console.log('Using customerId:', customerId);

        let apiKeys = await db.query(`
            SELECT ak.*, 
                   COALESCE((SELECT COUNT(*) FROM api_usage au 
                    WHERE au.api_key_id = ak.id 
                    AND au.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)), 0) as daily_usage,
                   COALESCE((SELECT COUNT(*) FROM api_usage au 
                    WHERE au.api_key_id = ak.id 
                    AND au.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 0) as monthly_usage,
                   COALESCE((SELECT MAX(timestamp) FROM api_usage au WHERE au.api_key_id = ak.id), NULL) as last_used
            FROM api_keys ak
            WHERE ak.customer_id = ? AND ak.is_active = TRUE
            ORDER BY ak.created_at DESC`,
            [customerId]
        );

        // Failsafe: Ensure apiKeys is always an array
        apiKeys = Array.isArray(apiKeys) ? apiKeys : [];
        
        console.log('Found API keys:', JSON.stringify(apiKeys, null, 2));
        console.log(`Retrieved ${apiKeys.length} active API keys`);

        if (apiKeys.length > 0) {
            apiKeys.forEach(key => {
                if (key) {
                    console.log(`Key ${key.id} statistics:`, {
                        daily_usage: key.daily_usage || 0,
                        monthly_usage: key.monthly_usage || 0,
                        last_used: key.last_used || 'never'
                    });
                }
            });
        } else {
            console.log('No active API keys found for this customer');
        }

        res.json(apiKeys);
        console.log('Successfully sent API keys response');
    } catch (error) {
        console.error('Get API keys error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Fehler beim Abrufen der API-Schlüssel',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const createApiKey = async (req, res) => {
    console.log('createApiKey called with userId:', req.user.userId);
    
    try {
        const userId = req.user.userId;
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: 'Ein gültiger Name für den API-Schlüssel ist erforderlich' });
        }

        const profiles = await db.query(
            'SELECT id FROM customer_profiles WHERE user_id = ?',
            [userId]
        );

        if (!profiles || profiles.length === 0 || !profiles[0] || !profiles[0].id) {
            console.log('No customer profile found for userId:', userId);
            return res.status(404).json({ error: 'Kundenprofil nicht gefunden' });
        }

        const customerId = profiles[0].id;
        console.log('Using customerId:', customerId);

        const keyCount = await db.query(
            'SELECT COUNT(*) as count FROM api_keys WHERE customer_id = ? AND is_active = TRUE',
            [customerId]
        );

        const currentCount = getCountFromResult(keyCount);
        console.log('Current API key count:', currentCount);

        if (currentCount >= 5) {
            return res.status(400).json({ error: 'Maximale Anzahl an API-Schlüsseln erreicht (5)' });
        }

        const apiKey = generateApiKey();
        const result = await db.query(
            'INSERT INTO api_keys (customer_id, api_key, name, created_by) VALUES (?, ?, ?, ?)',
            [customerId, apiKey, name.trim(), userId]
        );

        if (!result || !result.insertId) {
            throw new Error('Failed to insert new API key');
        }

        res.status(201).json({
            id: result.insertId,
            api_key: apiKey,
            name: name.trim(),
            created_at: new Date(),
            is_active: true
        });
        console.log('Successfully created new API key with ID:', result.insertId);
    } catch (error) {
        console.error('Create API key error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Fehler beim Erstellen des API-Schlüssels',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const deleteApiKey = async (req, res) => {
    console.log('deleteApiKey called with userId:', req.user.userId, 'keyId:', req.params.id);
    
    try {
        const userId = req.user.userId;
        const keyId = req.params.id;

        if (!keyId || isNaN(keyId)) {
            return res.status(400).json({ error: 'Ungültige API-Schlüssel ID' });
        }

        const profiles = await db.query(
            'SELECT id FROM customer_profiles WHERE user_id = ?',
            [userId]
        );

        if (!profiles || profiles.length === 0 || !profiles[0] || !profiles[0].id) {
            console.log('No customer profile found for userId:', userId);
            return res.status(404).json({ error: 'Kundenprofil nicht gefunden' });
        }

        const customerId = profiles[0].id;
        console.log('Using customerId:', customerId);

        const result = await db.query(
            'UPDATE api_keys SET is_active = FALSE WHERE id = ? AND customer_id = ?',
            [keyId, customerId]
        );

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ error: 'API-Schlüssel nicht gefunden' });
        }

        res.json({ message: 'API-Schlüssel erfolgreich deaktiviert' });
        console.log('Successfully deactivated API key:', keyId);
    } catch (error) {
        console.error('Delete API key error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Fehler beim Deaktivieren des API-Schlüssels',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getApiKeyUsage = async (req, res) => {
    console.log('getApiKeyUsage called with userId:', req.user.userId, 'keyId:', req.params.id);
    
    try {
        const userId = req.user.userId;
        const keyId = req.params.id;
        const period = req.query.period || 'day';
        const start = req.query.start || new Date(Date.now() - 24*60*60*1000).toISOString();
        const end = req.query.end || new Date().toISOString();

        if (!keyId || isNaN(keyId)) {
            return res.status(400).json({ error: 'Ungültige API-Schlüssel ID' });
        }

        const profiles = await db.query(
            'SELECT id FROM customer_profiles WHERE user_id = ?',
            [userId]
        );

        if (!profiles || profiles.length === 0 || !profiles[0] || !profiles[0].id) {
            console.log('No customer profile found for userId:', userId);
            return res.status(404).json({ error: 'Kundenprofil nicht gefunden' });
        }

        const customerId = profiles[0].id;
        console.log('Using customerId:', customerId);
        console.log('Using keyId: ', keyId);
        // Get API key and its associated plan limits
        const keyInfo = await db.query(`
            SELECT ak.id, cs.plan_id 
            FROM api_keys ak
            JOIN customer_profiles cp ON ak.customer_id = cp.id
            JOIN customer_subscriptions cs ON cp.id = cs.customer_id
            WHERE ak.id = ? AND ak.customer_id = ? AND ak.is_active = TRUE
            AND cs.is_active = TRUE
            ORDER BY cs.starts_at DESC
            LIMIT 1
        `, [keyId, customerId]);

        if (!keyInfo || keyInfo.length === 0) {
            return res.status(404).json({ error: 'API-Schlüssel nicht gefunden' });
        }

        // Get plan limits
        const limits = await db.query(`
            SELECT limit_type, limit_value
            FROM api_limits
            WHERE plan_id = ?
        `, [keyInfo[0].plan_id]);

        const dailyLimit = limits.find(l => l.limit_type === 'per_day')?.limit_value || null;
        const monthlyLimit = limits.find(l => l.limit_type === 'per_month')?.limit_value || null;

        // Get usage statistics
        const [dailyStats] = await db.query(`
            SELECT 
                COUNT(*) as total_requests,
                COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count,
                AVG(response_time) as avg_response_time
            FROM api_usage
            WHERE api_key_id = ?
            AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        `, [keyId]);

        const [monthlyStats] = await db.query(`
            SELECT COUNT(*) as total_requests
            FROM api_usage
            WHERE api_key_id = ?
            AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `, [keyId]);

        // Get endpoint usage
        // Get endpoint usage with base path only
const endpointStats = await db.query(`
    SELECT 
        SUBSTRING_INDEX(endpoint, '?', 1) as endpoint,  -- This strips everything after the ?
        COUNT(*) as request_count,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count,
        AVG(response_time) as avg_response_time
    FROM api_usage
    WHERE api_key_id = ?
    AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    GROUP BY SUBSTRING_INDEX(endpoint, '?', 1)  -- Group by the base path
`, [keyId]);

        // Get usage by period
        const periodStats = await db.query(`
            SELECT 
                DATE_FORMAT(timestamp, '%Y-%m-%d') as period,
                'day' as period_type,
                COUNT(*) as request_count
            FROM api_usage
            WHERE api_key_id = ?
            AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d')
        `, [keyId]);

        const errorRate = dailyStats.total_requests > 0 
            ? ((dailyStats.error_count / dailyStats.total_requests) * 100).toFixed(2)
            : '0.00';

        const response = {
            usage: {
                byPeriod: periodStats.map(p => ({
                    period: p.period,
                    period_type: p.period_type,
                    request_count: p.request_count
                })),
                byEndpoint: endpointStats.map(e => ({
                    endpoint: e.endpoint,
                    request_count: e.request_count,
                    error_count: e.error_count,
                    avg_response_time: Math.round(e.avg_response_time || 0)
                }))
            },
            limits: {
                daily: dailyLimit,
                monthly: monthlyLimit
            },
            metrics: {
                totalRequests: dailyStats.total_requests || 0,
                avgResponseTime: Math.round(dailyStats.avg_response_time || 0),
                errorRate: errorRate
            }
        };

        res.json(response);
        console.log('Successfully retrieved usage statistics for key:', keyId);
    } catch (error) {
        console.error('Get API key usage error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Fehler beim Abrufen der API-Nutzungsstatistiken',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getApiKeys,
    createApiKey,
    deleteApiKey,
    getApiKeyUsage
};
