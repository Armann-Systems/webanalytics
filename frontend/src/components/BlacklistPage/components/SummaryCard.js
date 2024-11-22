import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const SummaryCard = ({ data }) => {
  if (!data) return null;

  const renderRiskLevel = (riskLevel) => {
    if (!riskLevel || !riskLevel.level) return null;

    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };

    const colorClass = colors[riskLevel.level] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}>
        {riskLevel.level} {riskLevel.score !== undefined && `(${riskLevel.score})`}
      </span>
    );
  };

  const isDomainCheck = Boolean(data.domain);
  const summary = data.summary || {};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Source Information */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Geprüfte Quelle</h3>
            <InfoTooltip
              title="Geprüfte Quelle"
              content="Die IP-Adresse oder Domain, die auf Blacklist-Einträge überprüft wurde"
            />
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {data.domain || data.ip || 'Nicht verfügbar'}
          </p>
          {data.networkInfo?.reverseDns && (
            <p className="text-sm text-gray-500 mt-1">
              Reverse DNS: {data.networkInfo.reverseDns}
            </p>
          )}
        </div>

        {/* Checked Items Count */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">
              {isDomainCheck ? 'Geprüfte IPs' : 'Geprüfte Blacklists'}
            </h3>
            <InfoTooltip
              title={isDomainCheck ? 'Geprüfte IPs' : 'Geprüfte Blacklists'}
              content={isDomainCheck 
                ? "Anzahl der überprüften IP-Adressen (A Records und Mail Server)"
                : "Anzahl der überprüften Blacklist-Provider"
              }
            />
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {isDomainCheck ? (summary.totalIPs || 0) : (summary.totalChecks || 0)}
          </p>
        </div>

        {/* Blacklist Information */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">
              {isDomainCheck ? 'Geprüfte Blacklists' : 'Listungen gefunden'}
            </h3>
            <InfoTooltip
              title={isDomainCheck ? 'Geprüfte Blacklists' : 'Blacklist Hits'}
              content={isDomainCheck
                ? "Gesamtzahl der überprüften Blacklist-Provider pro IP"
                : "Anzahl der Blacklists, in denen die IP gelistet ist"
              }
            />
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {isDomainCheck ? (summary.totalChecks || 0) : (summary.listedCount || 0)}
          </p>
        </div>

        {/* Risk Level */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Risiko-Level</h3>
            <InfoTooltip
              title="Risk Level"
              content={
                <div className="space-y-2">
                  <p>Bewertung des Gesamtrisikos basierend auf:</p>
                  <ul className="list-disc list-inside">
                    <li>Anzahl der Listungen</li>
                    <li>Zuverlässigkeit der Provider</li>
                    <li>Art der Listungen</li>
                  </ul>
                </div>
              }
            />
          </div>
          <div className="mt-2">
            {renderRiskLevel(summary.riskLevel)}
          </div>
        </div>
      </div>

      {/* Query Metrics */}
      {data.queryMetrics && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-500">Abfrage Metriken</h3>
            <InfoTooltip
              title="Query Metrics"
              content="Performance-Metriken der Blacklist-Überprüfung, einschließlich Gesamtzeit und durchschnittlicher Antwortzeit der Provider"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {data.queryMetrics.totalTimeMs !== undefined && (
              <div>
                <span className="text-gray-500">Gesamtzeit:</span>
                <span className="ml-2 text-gray-900">{Math.round(data.queryMetrics.totalTimeMs)}ms</span>
              </div>
            )}
            {data.queryMetrics.averageResponseTimeMs !== undefined && (
              <div>
                <span className="text-gray-500">Durchschnittliche Antwortzeit:</span>
                <span className="ml-2 text-gray-900">
                  {Math.round(data.queryMetrics.averageResponseTimeMs)}ms
                </span>
              </div>
            )}
            {summary.reliabilityScore !== undefined && (
              <div>
                <span className="text-gray-500">Zuverlässigkeit:</span>
                <span className="ml-2 text-gray-900">{summary.reliabilityScore}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
