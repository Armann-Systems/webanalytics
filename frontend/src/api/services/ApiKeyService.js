import api from '../index';

class ApiKeyService {
    static async getApiKeys() {
        const response = await api.get('/api-keys');
        return response.data;
    }

    static async createApiKey(name) {
        const response = await api.post('/api-keys', { name });
        return response.data;
    }

    static async deleteApiKey(keyId) {
        const response = await api.delete(`/api-keys/${keyId}`);
        return response.data;
    }

    static async getApiKeyUsage(keyId, period = 'day', start = null, end = null) {
        const params = new URLSearchParams();
        if (period) params.append('period', period);
        if (start) params.append('start', start);
        if (end) params.append('end', end);

        const response = await api.get(`/api-keys/${keyId}/usage?${params.toString()}`);
        return this.formatUsageData(response.data);
    }

    // Helper method to format usage data for display
    static formatUsageData(data) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get daily usage from today's data
        const dailyUsage = data.usage.byPeriod.find(
            p => new Date(p.period).toDateString() === startOfDay.toDateString()
        )?.request_count || 0;

        // Calculate monthly usage by summing all requests within the current month
        const monthlyUsage = data.usage.byPeriod
            .filter(p => new Date(p.period) >= startOfMonth)
            .reduce((sum, p) => sum + p.request_count, 0);

        return {
            daily: {
                used: dailyUsage,
                limit: data.limits.daily,
                errors: data.metrics.errorRate,
                avgResponseTime: data.metrics.avgResponseTime
            },
            monthly: {
                used: monthlyUsage,
                limit: data.limits.monthly
            },
            metrics: {
                totalRequests: data.metrics.totalRequests,
                avgResponseTime: data.metrics.avgResponseTime,
                errorRate: data.metrics.errorRate
            },
            endpointUsage: data.usage.byEndpoint.map(endpoint => ({
                name: endpoint.endpoint,
                requests: endpoint.request_count,
                avgResponseTime: Math.round(endpoint.avg_response_time),
                errorRate: endpoint.request_count ? 
                    (endpoint.error_count / endpoint.request_count * 100).toFixed(2) : 0
            }))
        };
    }

    // Helper method to calculate usage percentage
    static calculateUsagePercentage(used, limit) {
        if (!limit) return 0; // Handle unlimited plans
        return Math.min(Math.round((used / limit) * 100), 100);
    }

    // Helper method to get status color based on usage percentage
    static getStatusColor(percentage) {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    }

    // Helper method to format date
    static formatDate(dateString) {
        if (!dateString) return 'Noch nicht verwendet';
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Helper method to format response time
    static formatResponseTime(ms) {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    }

    // Helper method to get time period for queries
    static getTimePeriod(period = 'day') {
        const now = new Date();
        const start = new Date();
        
        switch (period) {
            case 'day':
                start.setHours(0, 0, 0, 0);
                break;
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            default:
                start.setHours(0, 0, 0, 0);
        }

        return {
            start: start.toISOString(),
            end: now.toISOString()
        };
    }
}

export default ApiKeyService;
