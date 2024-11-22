import React from 'react';
import RecordSection from './RecordSection';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import CopyButton from './CopyButton';

const DMARCRecords = ({ data, isLoading }) => {
  const renderValidationStatus = () => {
    if (!data) return null;

    if (!data.valid) {
      return (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">DMARC Policy Not Configured</p>
            <p className="text-sm mt-1">
              Your domain lacks DMARC protection. DMARC helps prevent email spoofing and phishing attacks. 
              Consider implementing a DMARC policy to enhance your email security.
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium">Recommended Actions:</p>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Create a DMARC record starting with a monitoring policy (p=none)</li>
                <li>Configure SPF and DKIM authentication for your domain</li>
                <li>Monitor email authentication results through DMARC reports</li>
                <li>Gradually strengthen your policy as you verify legitimate email sources</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">DMARC Policy Configured</p>
          <p className="text-sm mt-1">
            Your domain has a valid DMARC policy in place, helping protect against email spoofing.
          </p>
        </div>
      </div>
    );
  };

  const getPolicyType = (record) => {
    if (!record || !record.raw) return null;
    
    const rawRecord = record.raw;
    if (rawRecord.includes('p=none')) return {
      label: 'Monitoring Mode (p=none)',
      className: 'bg-blue-50 text-blue-600 border-blue-100'
    };
    if (rawRecord.includes('p=quarantine')) return {
      label: 'Quarantine Mode (p=quarantine)',
      className: 'bg-yellow-50 text-yellow-600 border-yellow-100'
    };
    if (rawRecord.includes('p=reject')) return {
      label: 'Reject Mode (p=reject)',
      className: 'bg-red-50 text-red-600 border-red-100'
    };
    return null;
  };

  const renderContent = () => {
    if (!data) return null;
    
    return (
      <div className="space-y-6">
        {/* Validation Status */}
        {renderValidationStatus()}

        {/* DMARC Records */}
        {data.dmarcRecords?.length > 0 ? (
          <div className="space-y-4">
            {data.dmarcRecords.map((record, index) => {
              const policyType = getPolicyType(record);
              
              return (
                <div key={index} className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] p-6 rounded-xl border border-black/[0.03]">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-black/60" />
                    <span className="font-medium">
                      {index === 0 ? 'Primary DMARC Record' : `Additional DMARC Record ${index + 1}`}
                    </span>
                  </div>

                  {/* Record Content */}
                  <div className="bg-white p-4 rounded-lg border border-black/[0.03] flex items-start justify-between gap-4">
                    <div className="font-mono text-sm break-all flex-1">
                      {record.raw || 'No content'}
                    </div>
                    {record.raw && <CopyButton text={record.raw} className="flex-shrink-0" />}
                  </div>

                  {/* Policy Info */}
                  {index === 0 && policyType && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-black/[0.03]">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-black/60" />
                          <span className="font-medium">Policy</span>
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full border ${policyType.className}`}>
                            {policyType.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl border border-black/[0.03]">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-black/70">No DMARC records found</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <RecordSection
      title="DMARC Records"
      data={data}
      isLoading={isLoading}
      metrics={data?.queryMetrics}
    >
      {renderContent()}
    </RecordSection>
  );
};

export default DMARCRecords;
