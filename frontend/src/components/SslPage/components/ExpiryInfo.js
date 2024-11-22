import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const ExpiryInfo = ({ data }) => {
  if (!data) return null;

  const getStatusColor = (level) => {
    switch (level.toUpperCase()) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Zertifikats-Ablauf
          <InfoTooltip
            title="Zertifikats-Ablauf"
            content="Informationen über die Gültigkeit des SSL/TLS-Zertifikats und dessen Ablaufdatum."
          />
        </h2>
      </div>

      <div className="space-y-6">
        {/* Validity Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Status
            <InfoTooltip
              title="Gültigkeitsstatus"
              content="Aktueller Status des Zertifikats und verbleibende Gültigkeitsdauer."
            />
          </h3>
          <div className={`p-3 rounded-lg ${getStatusColor(data.validity.status.level)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{data.validity.status.message}</span>
              <span className="text-sm">
                {data.validity.daysRemaining} Tage verbleibend
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(
                  data.validity.validityPercentageUsed
                )}`}
                style={{ width: `${data.validity.validityPercentageUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600">
              <span>{data.validity.usedValidityDays} Tage verwendet</span>
              <span>{data.validity.totalValidityDays} Tage Gesamtlaufzeit</span>
            </div>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            Zertifikatsdetails
            <InfoTooltip
              title="Zertifikatsdetails"
              content="Detaillierte Informationen über das SSL/TLS-Zertifikat."
            />
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Ausgestellt für:</div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="font-mono text-sm">
                    {data.certificate.subject.CN}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Ausgestellt von:</div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="font-mono text-sm">
                    {data.certificate.issuer.O || data.certificate.issuer.CN}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Alternative Namen:</div>
              <div className="space-y-2">
                {data.certificate.subjectAltNames.map((san, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border border-gray-200 flex items-center justify-between"
                  >
                    <span className="font-mono text-sm">{san.value}</span>
                    <span className="text-xs text-gray-500">{san.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transparency Info */}
        {data.transparency && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              Certificate Transparency
              <InfoTooltip
                title="Certificate Transparency"
                content="Informationen über die Aufnahme des Zertifikats in öffentliche CT-Logs."
              />
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={data.transparency.included ? 'text-green-600' : 'text-red-600'}>
                  {data.transparency.included ? '✓' : '✗'}
                </span>
                <span className="text-sm">
                  {data.transparency.included
                    ? 'In CT-Logs aufgenommen'
                    : 'Nicht in CT-Logs gefunden'}
                </span>
              </div>
              {data.transparency.included && data.transparency.logs.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">CT-Logs:</div>
                  <div className="space-y-1">
                    {data.transparency.logs.map((log, index) => (
                      <div
                        key={index}
                        className="bg-white p-2 rounded border border-gray-200 text-sm"
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-700 mb-3">Empfehlungen</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-600">
              {data.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryInfo;
