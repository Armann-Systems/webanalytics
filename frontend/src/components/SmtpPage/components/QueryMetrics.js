import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const QueryMetrics = ({ metrics }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPerformanceStatus = (timeMs) => {
    if (timeMs < 500) {
      return {
        color: 'bg-green-100 text-green-800',
        text: 'Ausgezeichnet'
      };
    }
    if (timeMs < 1000) {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Gut'
      };
    }
    return {
      color: 'bg-red-100 text-red-800',
      text: 'Verbesserungswürdig'
    };
  };

  const status = getPerformanceStatus(metrics.totalTimeMs);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">Performance Metriken</h2>
        <InfoTooltip 
          title="SMTP Performance"
          content={
            <div className="space-y-2">
              <p>Detaillierte Performance-Metriken der SMTP-Tests:</p>
              <ul className="list-disc list-inside">
                <li>Gesamtzeit der Abfragen</li>
                <li>Zeitstempel der Überprüfung</li>
                <li>Performance-Bewertung</li>
              </ul>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Gesamtzeit</h3>
            <InfoTooltip
              title="Gesamtzeit"
              content="Gesamtdauer aller SMTP-Tests und Überprüfungen"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-medium">{metrics.totalTimeMs.toFixed(2)} ms</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Zeitstempel</h3>
            <InfoTooltip
              title="Zeitstempel"
              content="Zeitpunkt der durchgeführten SMTP-Überprüfung"
            />
          </div>
          <p className="mt-2 text-lg font-medium">
            {formatDate(metrics.timestamp)}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <InfoTooltip
              title="Performance Status"
              content="Bewertung der SMTP-Server Performance basierend auf Antwortzeiten"
            />
          </div>
          <div className="mt-2">
            <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Visualization */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Performance-Verlauf</h3>
              <InfoTooltip
                title="Performance-Verlauf"
                content="Visualisierung der Ausführungszeit im Verhältnis zu Performance-Schwellenwerten"
              />
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${Math.min(100, (metrics.totalTimeMs / 1000) * 100)}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    metrics.totalTimeMs < 500 ? 'bg-green-500' :
                    metrics.totalTimeMs < 1000 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>0 ms</span>
                <span>500 ms</span>
                <span>1000 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Legend */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">Performance-Bewertung</h3>
            <InfoTooltip
              title="Performance-Bewertung"
              content="Erklärung der verschiedenen Performance-Kategorien und deren Bedeutung"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm">Ausgezeichnet (&lt; 500 ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-sm">Gut (500 - 1000 ms)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm">Verbesserungswürdig (&gt; 1000 ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryMetrics;
