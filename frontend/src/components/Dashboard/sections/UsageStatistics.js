import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Activity, AlertCircle, Zap, Server } from 'lucide-react';
import ApiKeyService from '../../../api/services/ApiKeyService';

const UsageStatistics = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        daily: { used: 0, limit: 0 },
        monthly: { used: 0, limit: 0 },
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        endpointUsage: {},
        apiKeys: []
    });

    useEffect(() => {
        loadUsageStats();
    }, []);

    const loadUsageStats = async () => {
        try {
            const apiKeys = await ApiKeyService.getApiKeys();
            const period = ApiKeyService.getTimePeriod('month');
            
            const usagePromises = apiKeys.map(key => 
                ApiKeyService.getApiKeyUsage(key.id, 'month', period.start, period.end)
                    .catch(err => {
                        console.error(`Error fetching usage for key ${key.id}:`, err);
                        return null;
                    })
            );

            const usageData = await Promise.all(usagePromises);

            const aggregatedStats = {
                daily: { used: 0, limit: 0 },
                monthly: { used: 0, limit: 0 },
                totalRequests: 0,
                avgResponseTime: 0,
                errorRate: 0,
                endpointUsage: {},
                apiKeys: apiKeys.map((key, index) => ({
                    ...key,
                    usage: usageData[index]
                })).filter(key => key.usage !== null)
            };

            // Aggregate stats across all API keys
            let validKeyCount = 0;
            usageData.forEach(usage => {
                if (usage) {
                    validKeyCount++;
                    aggregatedStats.daily.used += usage.daily?.used || 0;
                    aggregatedStats.daily.limit = usage.daily?.limit || 0;
                    aggregatedStats.monthly.used += usage.monthly?.used || 0;
                    aggregatedStats.monthly.limit = usage.monthly?.limit || 0;
                    aggregatedStats.totalRequests += usage.metrics?.totalRequests || 0;
                    aggregatedStats.avgResponseTime += usage.metrics?.avgResponseTime || 0;
                    aggregatedStats.errorRate += parseFloat(usage.metrics?.errorRate || 0);

                    // Aggregate endpoint usage
                    (usage.endpointUsage || []).forEach(endpoint => {
                        if (!aggregatedStats.endpointUsage[endpoint.name]) {
                            aggregatedStats.endpointUsage[endpoint.name] = {
                                requests: 0,
                                avgResponseTime: 0,
                                errorRate: 0
                            };
                        }
                        aggregatedStats.endpointUsage[endpoint.name].requests += endpoint.requests || 0;
                        aggregatedStats.endpointUsage[endpoint.name].avgResponseTime += endpoint.avgResponseTime || 0;
                        aggregatedStats.endpointUsage[endpoint.name].errorRate += parseFloat(endpoint.errorRate || 0);
                    });
                }
            });

            // Calculate averages for metrics that need it
            if (validKeyCount > 0) {
                aggregatedStats.avgResponseTime = Math.round(aggregatedStats.avgResponseTime / validKeyCount);
                aggregatedStats.errorRate = (aggregatedStats.errorRate / validKeyCount).toFixed(2);
                
                Object.values(aggregatedStats.endpointUsage).forEach(endpoint => {
                    endpoint.avgResponseTime = Math.round(endpoint.avgResponseTime / validKeyCount);
                    endpoint.errorRate = (endpoint.errorRate / validKeyCount).toFixed(2);
                });
            }

            setStats(aggregatedStats);
            setError('');
        } catch (err) {
            setError('Fehler beim Laden der Nutzungsstatistiken');
            console.error(err);
            // Set default stats to prevent undefined errors
            setStats({
                daily: { used: 0, limit: 0 },
                monthly: { used: 0, limit: 0 },
                totalRequests: 0,
                avgResponseTime: 0,
                errorRate: 0,
                endpointUsage: {},
                apiKeys: []
            });
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (used, limit) => {
        if (!limit) return 0; // Handle unlimited plans
        return Math.min(Math.round((used / limit) * 100), 100);
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const formatNumber = (value) => {
        return (value || 0).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
                <span className="block transform hover:translate-x-2 transition-transform duration-300">
                    Nutzungsstatistiken
                </span>
            </h2>

            {error && (
                <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Overall Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Activity className="h-6 w-6 text-black/40" />
                            </div>
                            <div className="ml-5">
                                <div className="text-sm font-medium text-black/60">
                                    Gesamtanfragen
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {formatNumber(stats.totalRequests)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Zap className="h-6 w-6 text-black/40" />
                            </div>
                            <div className="ml-5">
                                <div className="text-sm font-medium text-black/60">
                                    Durchschn. Antwortzeit
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {ApiKeyService.formatResponseTime(stats.avgResponseTime || 0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-black/40" />
                            </div>
                            <div className="ml-5">
                                <div className="text-sm font-medium text-black/60">
                                    Fehlerrate
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                    {stats.errorRate || 0}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-black/40" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-black/60">
                                        Tägliche Nutzung
                                    </dt>
                                    <dd>
                                        <div className="flex items-center mt-2">
                                            <div className="flex-1">
                                                <div className="h-2.5 bg-black/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                                            getStatusColor(calculatePercentage(stats.daily?.used || 0, stats.daily?.limit || 0))
                                                        }`}
                                                        style={{ width: `${calculatePercentage(stats.daily?.used || 0, stats.daily?.limit || 0)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="ml-3 text-sm text-black/60">
                                                {formatNumber(stats.daily?.used)} / {stats.daily?.limit ? formatNumber(stats.daily.limit) : '∞'}
                                            </span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BarChart3 className="h-6 w-6 text-black/40" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-black/60">
                                        Monatliche Nutzung
                                    </dt>
                                    <dd>
                                        <div className="flex items-center mt-2">
                                            <div className="flex-1">
                                                <div className="h-2.5 bg-black/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                                            getStatusColor(calculatePercentage(stats.monthly?.used || 0, stats.monthly?.limit || 0))
                                                        }`}
                                                        style={{ width: `${calculatePercentage(stats.monthly?.used || 0, stats.monthly?.limit || 0)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="ml-3 text-sm text-black/60">
                                                {formatNumber(stats.monthly?.used)} / {stats.monthly?.limit ? formatNumber(stats.monthly.limit) : '∞'}
                                            </span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Endpoint Usage */}
            <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-6">
                    <h3 className="text-xl font-medium text-black mb-6">
                        <div className="flex items-center">
                            <Server className="h-5 w-5 text-black/40 mr-3" />
                            Endpunkt-Nutzung
                        </div>
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(stats.endpointUsage || {})
                            .sort(([,a], [,b]) => (b.requests || 0) - (a.requests || 0))
                            .map(([endpoint, usage]) => (
                                <div key={endpoint} className="border-b border-black/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-black">{endpoint}</span>
                                        <span className="text-sm text-black/60">
                                            {formatNumber(usage.requests)} Anfragen
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-black/60 mb-1">Antwortzeit</div>
                                            <div className="text-sm font-medium">
                                                {ApiKeyService.formatResponseTime(usage.avgResponseTime || 0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-black/60 mb-1">Fehlerrate</div>
                                            <div className="text-sm font-medium">
                                                {usage.errorRate || 0}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {Object.keys(stats.endpointUsage || {}).length === 0 && (
                            <p className="text-center text-black/60">
                                Keine Endpunkt-Nutzung vorhanden
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* API Keys Usage */}
            <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-6">
                    <h3 className="text-xl font-medium text-black mb-6">API-Schlüssel Nutzung</h3>
                    <div className="space-y-6">
                        {(stats.apiKeys || []).map((key) => (
                            <div key={key.id} className="border-b border-black/5 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Activity className="h-5 w-5 text-black/40 mr-3" />
                                        <span className="text-sm font-medium text-black">{key.name}</span>
                                    </div>
                                    <span className="text-sm text-black/60">
                                        Letzte Nutzung: {ApiKeyService.formatDate(key.last_used)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-xs text-black/60 mb-2">Heute</div>
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <div className="h-2.5 bg-black/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                                            getStatusColor(calculatePercentage(
                                                                key.usage?.daily?.used || 0,
                                                                key.usage?.daily?.limit || 0
                                                            ))
                                                        }`}
                                                        style={{ 
                                                            width: `${calculatePercentage(
                                                                key.usage?.daily?.used || 0,
                                                                key.usage?.daily?.limit || 0
                                                            )}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="ml-3 text-xs text-black/60">
                                                {formatNumber(key.usage?.daily?.used || 0)} Anfragen
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-black/60 mb-2">Dieser Monat</div>
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <div className="h-2.5 bg-black/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                                            getStatusColor(calculatePercentage(
                                                                key.usage?.monthly?.used || 0,
                                                                key.usage?.monthly?.limit || 0
                                                            ))
                                                        }`}
                                                        style={{ 
                                                            width: `${calculatePercentage(
                                                                key.usage?.monthly?.used || 0,
                                                                key.usage?.monthly?.limit || 0
                                                            )}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="ml-3 text-xs text-black/60">
                                                {formatNumber(key.usage?.monthly?.used || 0)} Anfragen
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <div className="text-xs text-black/60 mb-1">Antwortzeit</div>
                                        <div className="text-sm font-medium">
                                            {ApiKeyService.formatResponseTime(key.usage?.metrics?.avgResponseTime || 0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-black/60 mb-1">Fehlerrate</div>
                                        <div className="text-sm font-medium">
                                            {key.usage?.metrics?.errorRate || 0}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(stats.apiKeys || []).length === 0 && (
                            <p className="text-center text-black/60">
                                Keine API-Schlüssel vorhanden
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsageStatistics;
