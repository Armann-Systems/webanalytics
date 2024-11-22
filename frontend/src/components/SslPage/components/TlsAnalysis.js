import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const TlsAnalysis = ({ tlsSupport }) => {
  if (!tlsSupport) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          TLS Protokoll Analyse
          <InfoTooltip
            title="TLS Protokoll Analyse"
            content="Detaillierte Analyse der unterstützten TLS-Protokolle und Cipher Suites."
          />
        </h2>
      </div>

      <div className="space-y-6">
        {/* Protocol Support */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Protokoll-Unterstützung
            <InfoTooltip
              title="Protokoll-Unterstützung"
              content="Übersicht der unterstützten TLS-Protokollversionen und deren Performance."
            />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(tlsSupport.protocols).map(([protocol, details]) => (
              <div
                key={protocol}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  details.supported ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {details.supported ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                  <span className="font-mono">{protocol}</span>
                </div>
                {details.supported && (
                  <span className="text-sm text-gray-600">
                    {details.responseTimeMs.toFixed(1)}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cipher Suites */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Cipher Suites
            <InfoTooltip
              title="Cipher Suites"
              content="Unterstützte Verschlüsselungsalgorithmen und deren Performance."
            />
          </h3>
          <div className="space-y-2">
            {Object.entries(tlsSupport.ciphers).map(([cipher, details]) => (
              <div
                key={cipher}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  details.supported ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {details.supported ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✗</span>
                  )}
                  <div>
                    <div className="font-mono text-sm">{cipher}</div>
                    {details.supported && (
                      <div className="text-xs text-gray-500 mt-1">
                        Antwortzeit: {details.responseTimeMs.toFixed(1)}ms
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getCipherStrength(cipher)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-700 mb-3">Empfehlungen</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-600">
            <li>TLSv1.3 bietet die beste Sicherheit und Performance</li>
            <li>Ältere Protokolle (TLSv1.0, TLSv1.1) sollten deaktiviert werden</li>
            <li>Bevorzugen Sie ECDHE und AES-GCM basierte Cipher Suites</li>
            <li>Regelmäßige Überprüfung der Cipher-Konfiguration empfohlen</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const getCipherStrength = (cipher) => {
  if (cipher.includes('256')) {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
        Stark (256-bit)
      </span>
    );
  }
  if (cipher.includes('128')) {
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
        Gut (128-bit)
      </span>
    );
  }
  return (
    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
      Schwach
    </span>
  );
};

export default TlsAnalysis;
