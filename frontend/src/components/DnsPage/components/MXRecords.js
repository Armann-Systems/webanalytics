import React from 'react';
import RecordSection from './RecordSection';
import { Clock, Server, Network, ArrowRight } from 'lucide-react';
import CopyButton from './CopyButton';

const MXRecords = ({ data, isLoading }) => {
  const formatResponseTime = (time) => {
    return Math.round(time);
  };

  const renderContent = () => {
    if (!data?.mxRecords?.length) {
      return (
        <div className="bg-amber-50 text-amber-600 p-4 rounded-xl border border-amber-100">
          <p className="font-medium">Keine MX Records gefunden</p>
          <p className="text-sm mt-1">Diese Domain hat keine Mail Exchange Records konfiguriert.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {data.mxRecords.map((record, index) => (
          <div key={index} className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] p-6 rounded-xl border border-black/[0.03]">
            <div className="space-y-4">
              {/* Exchange and Priority */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{record.exchange}</span>
                    <CopyButton text={record.exchange} />
                  </div>
                  <div className="text-sm text-black/60 mt-1">Priority: {record.priority}</div>
                </div>
                {record.connectionTest?.responseTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {formatResponseTime(record.connectionTest.responseTime)}ms
                    </span>
                  </div>
                )}
              </div>

              {/* IP Addresses */}
              {record.addresses?.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-black/[0.03]">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-black/60" />
                    <span className="font-medium">IP Addresses</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {record.addresses.map((ip, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="font-mono text-sm">{ip}</span>
                        <CopyButton text={ip} small />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reverse DNS */}
              {record.reverseDns && (
                <div className="bg-white rounded-lg p-4 border border-black/[0.03]">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-4 h-4 text-black/60" />
                    <span className="font-medium">Reverse DNS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{record.reverseDns}</span>
                    <CopyButton text={record.reverseDns} small />
                  </div>
                </div>
              )}

              {/* Connection Test */}
              <div className="bg-white rounded-lg p-4 border border-black/[0.03]">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-black/60" />
                  <span className="font-medium">Connection Test</span>
                  {record.connectionTest?.connected ? (
                    <span className="text-sm px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                      Connected
                    </span>
                  ) : (
                    <span className="text-sm px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                      Failed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <RecordSection
      title="Mail Server (MX)"
      data={data}
      isLoading={isLoading}
      metrics={data?.queryMetrics}
    >
      {renderContent()}
    </RecordSection>
  );
};

export default MXRecords;
