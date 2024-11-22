import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';
import CopyButton from '../../DnsPage/components/CopyButton';

const InfrastructureSection = ({ data }) => {
  if (!data || !data.relatedRecords) return null;

  const { a: aRecords = [], mx: mxRecords = [] } = data.relatedRecords;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Infrastruktur
          <InfoTooltip
            title="Infrastruktur"
            content="Übersicht der mit dieser Domain verbundenen Server und IP-Adressen."
          />
        </h2>
      </div>

      <div className="space-y-6">
        {/* A Records */}
        {aRecords.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-medium">A Records</h3>
              <InfoTooltip
                title="A Records"
                content="IPv4-Adressen, die mit dieser Domain verknüpft sind. Diese werden auf Blacklist-Einträge überprüft."
              />
            </div>
            <div className="space-y-2">
              {aRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                  <span className="font-mono text-sm">{record}</span>
                  <CopyButton text={record} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Mail Servers */}
        {mxRecords.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-medium">Mail Server</h3>
              <InfoTooltip
                title="Mail Server (MX Records)"
                content="Mail Exchange Server der Domain. Die Mail Server werden ebenfalls auf Blacklist-Einträge überprüft, da sie für den E-Mail-Versand relevant sind."
              />
            </div>
            <div className="space-y-2">
              {mxRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="px-2 py-1 bg-black/5 rounded text-xs font-medium">
                      Priority: {record.priority}
                    </div>
                    <span className="font-mono text-sm">{record.exchange}</span>
                  </div>
                  <CopyButton text={record.exchange} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Records Message */}
        {aRecords.length === 0 && mxRecords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Keine Infrastruktur-Informationen verfügbar
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructureSection;
