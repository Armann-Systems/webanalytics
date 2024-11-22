import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';
import CopyButton from '../../DnsPage/components/CopyButton';

const SslOverview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          SSL/TLS Übersicht
          <InfoTooltip
            title="SSL/TLS Übersicht"
            content="Zeigt grundlegende Informationen über die SSL/TLS-Konfiguration und Infrastruktur der Domain."
          />
        </h2>
      </div>

      <div className="space-y-6">
        {/* Infrastructure Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Infrastruktur
            <InfoTooltip
              title="Infrastruktur"
              content="IP-Adressen, die mit dieser Domain verknüpft sind."
            />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IPv4 Addresses */}
            <div>
              <h4 className="text-sm text-gray-600 mb-2">IPv4 Adressen</h4>
              {data.infrastructure.ipv4.length > 0 ? (
                <div className="space-y-2">
                  {data.infrastructure.ipv4.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                      <span className="font-mono text-sm">{ip}</span>
                      <CopyButton text={ip} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Keine IPv4 Adressen gefunden</div>
              )}
            </div>

            {/* IPv6 Addresses */}
            <div>
              <h4 className="text-sm text-gray-600 mb-2">IPv6 Adressen</h4>
              {data.infrastructure.ipv6.length > 0 ? (
                <div className="space-y-2">
                  {data.infrastructure.ipv6.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                      <span className="font-mono text-sm">{ip}</span>
                      <CopyButton text={ip} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Keine IPv6 Adressen gefunden</div>
              )}
            </div>
          </div>
        </div>

        {/* Security Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Sicherheitsbewertung
            <InfoTooltip
              title="Sicherheitsbewertung"
              content="Gesamtbewertung der SSL/TLS-Sicherheit basierend auf Zertifikaten, Protokollen und Cipher Suites."
            />
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${getScoreColor(data.security.score)}`}>
                {data.security.score}
              </div>
              <div>
                <div className="text-sm font-medium">Grade: {data.security.grade}</div>
                <div className="text-sm text-gray-600">von 100 Punkten</div>
              </div>
            </div>
            {data.security.recommendations.length > 0 && (
              <div className="text-sm text-blue-600">
                {data.security.recommendations.length} Empfehlung(en)
              </div>
            )}
          </div>
        </div>

        {/* Certificate Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Zertifikats-Übersicht
            <InfoTooltip
              title="Zertifikats-Übersicht"
              content="Zusammenfassung der gefundenen SSL/TLS-Zertifikate auf verschiedenen Ports."
            />
          </h3>
          <div className="space-y-3">
            {data.certificates.map((cert, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Port {cert.port}</span>
                  {cert.error ? (
                    <span className="text-sm text-red-600">{cert.error}</span>
                  ) : cert.connection?.protocol ? (
                    <span className={`text-sm ${getProtocolColor(cert.connection.protocol)}`}>
                      {cert.connection.protocol}
                    </span>
                  ) : null}
                </div>
                {!cert.error && (
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Ausgestellt für:</span>
                      <span className="font-mono">{cert.subject.CN}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ausgestellt von:</span>
                      <span className="font-mono">{cert.issuer.O || cert.issuer.CN}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

const getProtocolColor = (protocol) => {
  if (protocol === 'TLSv1.3') return 'text-green-600';
  if (protocol === 'TLSv1.2') return 'text-yellow-600';
  return 'text-red-600';
};

export default SslOverview;
