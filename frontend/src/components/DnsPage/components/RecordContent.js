import React from 'react';
import { Mail, Shield, AlertTriangle, Check, Clock, Globe } from 'lucide-react';
import CopyButton from './CopyButton';

export const renderMXContent = (data) => {
  if (!data?.mxRecords?.length) return null;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-medium text-black/60">Mail Server</p>
          <p className="text-lg font-semibold text-black">{data.mxRecords.length} Server</p>
        </div>

        {data.connectionTest && (
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Globe className="w-5 h-5 text-black" />
              </div>
              {data.connectionTest.connected ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <p className="text-sm font-medium text-black/60">Verbindung</p>
            <p className="text-lg font-semibold text-black">
              {data.connectionTest.connected ? 'Erfolgreich' : 'Fehlgeschlagen'}
            </p>
          </div>
        )}

        {data.connectionTest?.responseTime && (
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Clock className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="text-sm font-medium text-black/60">Response Time</p>
            <p className="text-lg font-semibold text-black">
              {Math.round(data.connectionTest.responseTime)}ms
            </p>
          </div>
        )}
      </div>

      {/* MX Records List */}
      <div className="space-y-3">
        {data.mxRecords.map((record, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-1 text-sm font-medium text-black/60 bg-black/5 rounded-lg">
                    Priority {record.priority}
                  </span>
                  {record.connectionTest?.connected && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      Erreichbar
                    </span>
                  )}
                </div>
                <code className="font-mono text-black">{record.exchange}</code>
                {record.reverseDns && (
                  <p className="mt-1 text-sm text-black/40">
                    Reverse DNS: {record.reverseDns}
                  </p>
                )}
              </div>
              <CopyButton text={record.exchange} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const renderTXTContent = (data) => {
  if (!data?.records?.length) return null;

  const categorizedRecords = data.records.reduce((acc, record) => {
    const category = record.category || 'OTHER';
    if (!acc[category]) acc[category] = [];
    acc[category].push(record);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(categorizedRecords).map(([category, records]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-black/60 mb-3">{category}</h3>
          <div className="space-y-3">
            {records.map((record, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {record.type !== 'UNKNOWN' && (
                      <span className="px-2.5 py-1 text-sm font-medium text-black/60 bg-black/5 rounded-lg mb-2 inline-block">
                        {record.type}
                      </span>
                    )}
                    <div className="font-mono text-sm text-black whitespace-pre-wrap break-all">
                      {record.record}
                    </div>
                  </div>
                  <CopyButton text={record.record} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const renderSPFContent = (data) => {
  if (!data?.spfRecords?.length) return null;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-white rounded-xl p-4 border border-black/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {data.valid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="font-medium text-black">
              {data.valid ? 'Gültige SPF Konfiguration' : 'SPF Fehler gefunden'}
            </span>
          </div>
        </div>
        {data.lookupCount !== undefined && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm text-black/60 mb-1">
              <span>DNS Lookups</span>
              <span>{data.lookupCount}/10</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  data.lookupCount > 10 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((data.lookupCount / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SPF Records */}
      <div className="space-y-3">
        {data.spfRecords.map((record, index) => {
          // Extract the record string, handling both string and object formats
          const recordString = typeof record === 'string' 
            ? record 
            : record.raw || record.value || JSON.stringify(record);

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-mono text-sm text-black whitespace-pre-wrap break-all">
                    {recordString}
                  </div>
                </div>
                <CopyButton text={recordString} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Text */}
      <p className="text-sm text-black/60 bg-black/[0.02] rounded-xl p-4">
        SPF (Sender Policy Framework) hilft beim Schutz vor E-Mail-Spoofing. 
        Die Anzahl der DNS-Lookups sollte 10 nicht überschreiten.
      </p>
    </div>
  );
};

export const renderDMARCContent = (data) => {
  if (!data?.dmarcRecords?.length) return null;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-white rounded-xl p-4 border border-black/[0.03]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.valid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="font-medium text-black">
              {data.valid ? 'Gültige DMARC Policy' : 'DMARC nicht konfiguriert'}
            </span>
          </div>
          {data.policy && (
            <span className="px-2.5 py-1 text-sm font-medium text-black/60 bg-black/5 rounded-lg">
              Policy: {data.policy}
            </span>
          )}
        </div>
      </div>

      {/* DMARC Records */}
      <div className="space-y-3">
        {data.dmarcRecords.map((record, index) => {
          // Extract the record string, handling both string and object formats
          const recordString = typeof record === 'string'
            ? record
            : record.raw || record.value || JSON.stringify(record);

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-mono text-sm text-black whitespace-pre-wrap break-all">
                    {recordString}
                  </div>
                </div>
                <CopyButton text={recordString} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Text */}
      <p className="text-sm text-black/60 bg-black/[0.02] rounded-xl p-4">
        DMARC (Domain-based Message Authentication, Reporting & Conformance) 
        definiert, wie mit E-Mails umgegangen werden soll, die SPF oder DKIM nicht bestehen.
      </p>
    </div>
  );
};
