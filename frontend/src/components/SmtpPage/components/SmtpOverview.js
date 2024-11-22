import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';
import CopyButton from '../../DnsPage/components/CopyButton';

const SmtpOverview = ({ mxRecords, queryMetrics }) => {
  const getServerStatus = (record) => {
    if (!record.tlsSupported) {
      return {
        color: 'bg-red-100 text-red-800',
        text: 'Unsicher'
      };
    }
    return {
      color: 'bg-green-100 text-green-800',
      text: 'Sicher'
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Mail Server</h3>
            <InfoTooltip
              title="Mail Server"
              content="Anzahl der konfigurierten Mail Server (MX Records) für diese Domain"
            />
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {mxRecords.length} {mxRecords.length === 1 ? 'Server' : 'Server'}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">TLS Support</h3>
            <InfoTooltip
              title="TLS Verschlüsselung"
              content={
                <div className="space-y-2">
                  <p>TLS (Transport Layer Security) Status:</p>
                  <ul className="list-disc list-inside">
                    <li>Verschlüsselte E-Mail-Übertragung</li>
                    <li>Schutz vor Man-in-the-Middle Angriffen</li>
                    <li>Standardmäßig aktiviert bei modernen Servern</li>
                  </ul>
                </div>
              }
            />
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {mxRecords.filter(r => r.tlsSupported).length} von {mxRecords.length}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Antwortzeit</h3>
            <InfoTooltip
              title="Server Antwortzeit"
              content="Durchschnittliche Antwortzeit der Mail Server bei SMTP-Verbindungen"
            />
          </div>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {Math.round(queryMetrics.totalTimeMs)}ms
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <InfoTooltip
              title="Server Status"
              content="Gesamtstatus der Mail Server basierend auf Erreichbarkeit, TLS-Support und Konfiguration"
            />
          </div>
          <div className="mt-2">
            {mxRecords.every(r => r.tlsSupported) ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Optimal
              </span>
            ) : mxRecords.some(r => r.tlsSupported) ? (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Verbesserungswürdig
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Kritisch
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mxRecords.map((record, index) => {
          const status = getServerStatus(record);
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Mail Server {index + 1}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Host:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{record.host}</span>
                        <CopyButton text={record.host} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">IP:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{record.ip}</span>
                        <CopyButton text={record.ip} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priorität:</span>
                      <span className="ml-2 font-mono text-sm">{record.priority}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Reverse DNS:</span>
                      <span className="ml-2 font-mono text-sm">{record.reverseDns}</span>
                    </div>
                  </div>

                  {record.features && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-sm font-medium">Server Features</h5>
                        <InfoTooltip
                          title="SMTP Features"
                          content="Unterstützte SMTP-Erweiterungen und Sicherheitsfunktionen des Mail Servers"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(record.features).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.banner && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-sm font-medium">Server Banner</h5>
                        <InfoTooltip
                          title="SMTP Banner"
                          content="Begrüßungsnachricht des SMTP-Servers, die Software und Version anzeigen kann"
                        />
                      </div>
                      <div className="bg-white p-2 rounded text-sm font-mono break-all">
                        {record.banner}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmtpOverview;
