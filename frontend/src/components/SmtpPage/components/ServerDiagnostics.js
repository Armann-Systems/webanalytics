import React, { useState } from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const ServerDiagnostics = ({ serverDiagnostics }) => {
  const [expandedServer, setExpandedServer] = useState(null);

  const getPortStatus = (isOpen) => {
    return isOpen ? {
      color: 'bg-green-100 text-green-800',
      text: 'Offen'
    } : {
      color: 'bg-red-100 text-red-800',
      text: 'Geschlossen'
    };
  };

  const getServerHealth = (server) => {
    const openPorts = Object.values(server.portTests).filter(test => test.open).length;
    const totalPorts = Object.keys(server.portTests).length;
    const hasTLS = server.tlsDetails.secure;

    if (openPorts === totalPorts && hasTLS) {
      return {
        color: 'bg-green-100 text-green-800',
        text: 'Optimal'
      };
    } else if (openPorts > 0) {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Eingeschränkt'
      };
    }
    return {
      color: 'bg-red-100 text-red-800',
      text: 'Kritisch'
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold">Server Diagnostik</h2>
        <InfoTooltip 
          title="SMTP Server Diagnostik"
          content={
            <div className="space-y-2">
              <p>Umfassende Diagnose der Mail Server:</p>
              <ul className="list-disc list-inside">
                <li>Port-Verfügbarkeit (25, 465, 587)</li>
                <li>TLS/SSL Verschlüsselung</li>
                <li>Antwortzeiten und Performance</li>
                <li>Server-Konfiguration</li>
              </ul>
            </div>
          }
        />
      </div>

      <div className="space-y-4">
        {serverDiagnostics.map((server, serverIndex) => {
          const health = getServerHealth(server);
          const isExpanded = expandedServer === serverIndex;

          return (
            <div key={serverIndex} className="bg-gray-50 rounded-lg overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedServer(isExpanded ? null : serverIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-medium">
                        {server.host} (Priorität: {server.priority})
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {Object.values(server.portTests).filter(test => test.open).length} von {Object.keys(server.portTests).length} Ports offen
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${health.color}`}>
                      {health.text}
                    </span>
                  </div>
                  <button
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label={isExpanded ? 'Einklappen' : 'Ausklappen'}
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4">
                  {/* Port Tests */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium">Port Tests</h4>
                      <InfoTooltip
                        title="SMTP Ports"
                        content={
                          <div className="space-y-2">
                            <p>Standard SMTP Ports:</p>
                            <ul className="list-disc list-inside">
                              <li>25: Standard SMTP</li>
                              <li>465: SMTPS (SSL)</li>
                              <li>587: Submission (STARTTLS)</li>
                            </ul>
                          </div>
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(server.portTests).map(([port, test]) => {
                        const status = getPortStatus(test.open);
                        return (
                          <div key={port} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Port {port}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                {status.text}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div>Service: {test.service}</div>
                              {test.responseTimeMs > 0 && (
                                <div>Antwortzeit: {test.responseTimeMs.toFixed(2)} ms</div>
                              )}
                              {test.error && (
                                <div className="text-red-600">
                                  Fehler: {test.error}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* TLS Details */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium">TLS Konfiguration</h4>
                      <InfoTooltip
                        title="TLS/SSL Verschlüsselung"
                        content="Transport Layer Security (TLS) verschlüsselt die SMTP-Kommunikation und schützt vor Abhören der E-Mails"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      {server.tlsDetails.secure ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              TLS Aktiv
                            </span>
                            <span className="text-sm text-gray-500">
                              Antwortzeit: {server.tlsDetails.responseTimeMs.toFixed(2)} ms
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            TLS Inaktiv
                          </span>
                          {server.tlsDetails.error && (
                            <div className="text-sm text-red-600 mt-2">
                              Fehler: {server.tlsDetails.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium">Performance</h4>
                      <InfoTooltip
                        title="Performance Metriken"
                        content="Detaillierte Antwortzeiten und Performance-Metriken des SMTP-Servers"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="text-gray-500">Durchschnittliche Antwortzeit:</span>
                        <span className="ml-2 font-medium">{server.averageResponseTime.toFixed(2)} ms</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <span className="text-gray-500">Gesamte Testzeit:</span>
                        <span className="ml-2 font-medium">{server.responseTimeMs.toFixed(2)} ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServerDiagnostics;
