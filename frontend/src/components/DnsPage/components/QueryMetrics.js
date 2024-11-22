import React from 'react';
import { Clock, Zap, Server, BarChart } from 'lucide-react';

const QueryMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const getResponseTimeClass = (time) => {
    if (time < 100) return 'text-green-500';
    if (time < 300) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatTime = (time) => {
    return `${Math.round(time)}ms`;
  };

  const findResponseTime = (obj) => {
    if (!obj) return null;
    if (typeof obj !== 'object') return null;
    
    // First pass: look for responseTime only
    const findResponseTimeOnly = (obj) => {
      if (!obj) return null;
      if (typeof obj !== 'object') return null;
      
      if ('responseTime' in obj) return obj.responseTime;
      
      for (const key in obj) {
        const result = findResponseTimeOnly(obj[key]);
        if (result !== null) return result;
      }
      
      return null;
    };
    
    // Try to find responseTime first
    const responseTime = findResponseTimeOnly(obj);
    if (responseTime !== null) return responseTime;
    
    // If no responseTime found, look for totalTimeMs
    if ('totalTimeMs' in obj) return obj.totalTimeMs;
    
    // Recursively search for totalTimeMs
    for (const key in obj) {
      const result = findResponseTime(obj[key]);
      if (result !== null) return result;
    }
    
    return null;
  };

  // Use totalTimeMs from the metrics
  const responseTime = findResponseTime(metrics);

  return (
    <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl border border-black/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
            <BarChart className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-lg font-semibold text-black">Performance Metrics</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Response Time */}
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Clock className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="text-sm font-medium text-black/60">Response Time</p>
            <p className={`text-lg font-semibold ${getResponseTimeClass(responseTime)}`}>
              {formatTime(responseTime)}
            </p>
          </div>

          {/* TTL */}
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Zap className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="text-sm font-medium text-black/60">TTL</p>
            <p className="text-lg font-semibold text-black">
              {metrics.ttl ? `${metrics.ttl}s` : 'N/A'}
            </p>
          </div>

          {/* DNS Server */}
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Server className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="text-sm font-medium text-black/60">DNS Server</p>
            <p className="text-lg font-semibold text-black">
              {metrics.server || 'Default'}
            </p>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-black/60">Performance</span>
            <span className={`font-medium ${getResponseTimeClass(responseTime)}`}>
              {responseTime < 100 ? 'Excellent' : responseTime < 300 ? 'Good' : 'Slow'}
            </span>
          </div>
          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                responseTime < 100
                  ? 'bg-green-500'
                  : responseTime < 300
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{
                width: `${Math.min((responseTime / 500) * 100, 100)}%`
              }}
            />
          </div>
          <p className="mt-2 text-sm text-black/40">
            Empfohlene Response Time: &lt;100ms
          </p>
        </div>
      </div>
    </div>
  );
};

export default QueryMetrics;
