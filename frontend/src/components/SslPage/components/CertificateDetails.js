import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';
import CopyButton from '../../DnsPage/components/CopyButton';

const CertificateDetails = ({ certificate }) => {
  if (!certificate) return null;

  // If there's an error with this certificate, show error state
  if (certificate.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Zertifikat (Port {certificate.port})
            <InfoTooltip
              title="Zertifikatsdetails"
              content="Detaillierte Informationen über das SSL/TLS-Zertifikat für diesen Port."
            />
          </h2>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-red-600">{certificate.error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Zertifikat (Port {certificate.port})
          <InfoTooltip
            title="Zertifikatsdetails"
            content="Detaillierte Informationen über das SSL/TLS-Zertifikat für diesen Port."
          />
        </h2>
        {certificate.connection?.protocol && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${getProtocolColor(certificate.connection.protocol)}`}>
              {certificate.connection.protocol}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subject Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              Subject
              <InfoTooltip
                title="Subject"
                content="Informationen über den Zertifikatsinhaber."
              />
            </h3>
            <div className="space-y-2">
              {Object.entries(certificate.subject).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{value}</span>
                    <CopyButton text={value} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issuer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              Aussteller
              <InfoTooltip
                title="Aussteller"
                content="Informationen über die Zertifizierungsstelle (CA)."
              />
            </h3>
            <div className="space-y-2">
              {Object.entries(certificate.issuer).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{value}</span>
                    <CopyButton text={value} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Gültigkeitszeitraum
            <InfoTooltip
              title="Gültigkeitszeitraum"
              content="Zeitraum, in dem das Zertifikat gültig ist."
            />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gültig ab:</span>
                <span className="font-mono">{certificate.validFrom}</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gültig bis:</span>
                <span className="font-mono">{certificate.validTo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Alternative Names */}
        {certificate.subjectAltNames && certificate.subjectAltNames.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              Alternative Namen (SAN)
              <InfoTooltip
                title="Subject Alternative Names"
                content="Zusätzliche Domains und IPs, für die das Zertifikat gültig ist."
              />
            </h3>
            <div className="space-y-2">
              {certificate.subjectAltNames.map((san, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">{san.type}</span>
                    <span className="font-mono text-sm">{san.value}</span>
                  </div>
                  <CopyButton text={san.value} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Details */}
        {certificate.connection && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              Verbindungsdetails
              <InfoTooltip
                title="Verbindungsdetails"
                content="Technische Details zur SSL/TLS-Verbindung."
              />
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Protokoll:</span>
                <span className={`font-mono ${getProtocolColor(certificate.connection.protocol)}`}>
                  {certificate.connection.protocol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cipher Suite:</span>
                <span className="font-mono">{certificate.connection.cipher.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Antwortzeit:</span>
                <span className="font-mono">{certificate.connection.responseTimeMs.toFixed(2)}ms</span>
              </div>
            </div>
          </div>
        )}

        {/* Fingerprints */}
        {certificate.fingerprints && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              Fingerabdrücke
              <InfoTooltip
                title="Fingerabdrücke"
                content="Kryptographische Hashwerte des Zertifikats."
              />
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">SHA-1:</div>
                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <span className="font-mono text-sm break-all">{certificate.fingerprints.sha1}</span>
                  <CopyButton text={certificate.fingerprints.sha1} />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">SHA-256:</div>
                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                  <span className="font-mono text-sm break-all">{certificate.fingerprints.sha256}</span>
                  <CopyButton text={certificate.fingerprints.sha256} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getProtocolColor = (protocol) => {
  if (protocol === 'TLSv1.3') return 'text-green-600';
  if (protocol === 'TLSv1.2') return 'text-yellow-600';
  return 'text-red-600';
};

export default CertificateDetails;
