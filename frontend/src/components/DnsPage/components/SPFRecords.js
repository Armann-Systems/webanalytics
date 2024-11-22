import React from 'react';
import RecordSection from './RecordSection';
import { Shield, List, AlertTriangle } from 'lucide-react';
import CopyButton from './CopyButton';

const QualifierBadge = ({ qualifier }) => {
  const colors = {
    '+': 'bg-green-50 text-green-600 border-green-100',
    '-': 'bg-red-50 text-red-600 border-red-100',
    '~': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    '?': 'bg-blue-50 text-blue-600 border-blue-100'
  };

  const labels = {
    '+': 'Pass',
    '-': 'Fail',
    '~': 'Softfail',
    '?': 'Neutral'
  };

  if (!qualifier) return null;

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${colors[qualifier] || colors['+']}`}>
      {labels[qualifier] || 'Unknown'}
    </span>
  );
};

const SPFRecords = ({ data, isLoading }) => {
  const renderMechanisms = (mechanisms = []) => {
    if (!mechanisms.length) return null;

    return mechanisms.map((mechanism, index) => (
      <div key={index} className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-black/[0.03]">
        <div className="flex items-center gap-3">
          <QualifierBadge qualifier={mechanism.qualifier} />
          <span className="font-medium">{mechanism.type || 'Unknown'}</span>
          {mechanism.value && (
            <span className="font-mono text-sm text-black/70">{mechanism.value}</span>
          )}
        </div>
        {mechanism.value && <CopyButton text={mechanism.value} small />}
      </div>
    ));
  };

  const renderContent = () => {
    if (!data?.spfRecords?.length) {
      return (
        <div className="bg-amber-50 text-amber-600 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Keine SPF Records gefunden</p>
            <p className="text-sm mt-1">
              Diese Domain hat keine SPF Records konfiguriert. SPF Records helfen dabei,
              E-Mail-Spoofing zu verhindern und die E-Mail-Sicherheit zu verbessern.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {data.spfRecords.map((record, index) => (
          <div key={index} className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] p-6 rounded-xl border border-black/[0.03]">
            {/* Raw Record */}
            {record.raw && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-black/60" />
                  <span className="font-medium">Raw Record</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-black/[0.03] flex items-start justify-between gap-4">
                  <div className="font-mono text-sm break-all flex-1">
                    {record.raw}
                  </div>
                  <CopyButton text={record.raw} className="flex-shrink-0" />
                </div>
              </div>
            )}

            {/* Mechanisms */}
            {record.mechanisms?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <List className="w-4 h-4 text-black/60" />
                  <span className="font-medium">Mechanisms</span>
                </div>
                <div className="space-y-2">
                  {renderMechanisms(record.mechanisms)}
                </div>
              </div>
            )}

            {/* Policy */}
            {record.policy && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-black/60" />
                  <span className="font-medium">Policy</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-black/[0.03] flex items-center gap-3">
                  <QualifierBadge qualifier={record.policy.charAt(0)} />
                  <span className="font-mono text-sm">{record.policy}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <RecordSection
      title="SPF Records"
      data={data}
      isLoading={isLoading}
      metrics={data?.queryMetrics}
    >
      {renderContent()}
    </RecordSection>
  );
};

export default SPFRecords;
