import React from 'react';
import { Globe, Check, Clock, AlertTriangle } from 'lucide-react';

const PropagationSection = ({ propagation = [] }) => {
  if (!propagation?.length) return null;

  const propagationStatus = propagation.reduce((acc, curr) => {
    if (curr.propagated) acc.propagated++;
    acc.total++;
    return acc;
  }, { propagated: 0, total: 0 });

  const avgResponseTime = propagation
    .filter(p => p.responseTime)
    .reduce((acc, curr, idx, arr) => acc + curr.responseTime / arr.length, 0);

  const getStatusColor = (responseTime) => {
    if (!responseTime) return 'text-yellow-500';
    if (responseTime < 100) return 'text-green-500';
    if (responseTime < 300) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Ensure server information is properly stringified
  const processServerInfo = (server) => ({
    ...server,
    server: typeof server.server === 'string' ? server.server : JSON.stringify(server.server),
    ip: typeof server.ip === 'string' ? server.ip : JSON.stringify(server.ip),
    error: typeof server.error === 'string' ? server.error : JSON.stringify(server.error)
  });

  return (
    <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl border border-black/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
            <Globe className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-lg font-semibold text-black">DNS Propagation</h2>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-black/40" />
          <span className="text-sm font-medium text-black/60">
            {avgResponseTime ? `Ø ${Math.round(avgResponseTime)}ms` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <div className="bg-white rounded-xl p-4 border border-black/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {propagationStatus.propagated === propagationStatus.total ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="font-medium text-black">
                {propagationStatus.propagated === propagationStatus.total
                  ? 'Vollständig propagiert'
                  : 'Propagierung läuft'}
              </span>
            </div>
            <span className="text-sm font-medium text-black/60">
              {propagationStatus.propagated}/{propagationStatus.total} DNS Server
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
              style={{
                width: `${(propagationStatus.propagated / propagationStatus.total) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Server Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {propagation.map((server, index) => {
            const processedServer = processServerInfo(server);
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {processedServer.propagated ? (
                      <div className="p-1.5 rounded-lg bg-green-50">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-yellow-50">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-black">{processedServer.server}</p>
                      <p className="text-sm text-black/40">{processedServer.ip}</p>
                    </div>
                  </div>
                  {processedServer.responseTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-black/40" />
                      <span className={`text-sm ${getStatusColor(processedServer.responseTime)}`}>
                        {Math.round(processedServer.responseTime)}ms
                      </span>
                    </div>
                  )}
                </div>
                {!processedServer.propagated && processedServer.error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {processedServer.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Text */}
        <p className="text-sm text-black/60 bg-black/[0.02] rounded-xl p-4">
          Die DNS-Propagierung zeigt an, wie gut Ihre DNS-Einträge weltweit verteilt sind. 
          Eine vollständige Propagierung bedeutet, dass alle DNS-Server die aktuellen Einträge kennen.
          <br /><br />
          <span className="font-medium">Response Time:</span>
          <br />
          • &lt;100ms: Ausgezeichnet
          <br />
          • &lt;300ms: Gut
          <br />
          • &gt;300ms: Verbesserungswürdig
        </p>
      </div>
    </div>
  );
};

export default PropagationSection;
