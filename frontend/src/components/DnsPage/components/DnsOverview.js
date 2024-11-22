import React from 'react';
import { Globe, Server, Clock, Check } from 'lucide-react';
import CopyButton from './CopyButton';

const DnsOverview = ({ data }) => {
  if (!data) return null;

  const metrics = [
    {
      icon: Globe,
      label: 'IP Adressen',
      value: `${data.records.a.records.length || 0} IPv4, ${data.records.aaaa.records.length || 0} IPv6`,
      detail: 'Aktive IP-Adressen'
    },
    {
      icon: Server,
      label: 'Nameserver',
      value: `${data.authoritativeNameservers?.length || 0} Server`,
      detail: 'Autoritative Nameserver'
    },
    {
      icon: Clock,
      label: 'TTL',
      value: `${data.ttl || 0} Sekunden`,
      detail: 'Time To Live'
    },
    {
      icon: Check,
      label: 'Status',
      value: data.status || 'Aktiv',
      detail: 'DNS Verfügbarkeit'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl border border-black/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/[0.03]">
        <h2 className="text-lg font-semibold text-black">DNS Übersicht</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Domain Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="text-sm font-medium text-black/60">Domain</h3>
            <CopyButton text={data.domain} />
          </div>
          <p className="text-lg font-medium text-black break-all">{data.domain}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-black/[0.03] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                  <metric.icon className="w-5 h-5 text-black" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-black/60">{metric.label}</p>
                <p className="text-lg font-semibold text-black">{metric.value}</p>
                <p className="text-sm text-black/40">{metric.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* IP Addresses */}
        {(data.ipv4Addresses?.length > 0 || data.ipv6Addresses?.length > 0) && (
          <div className="mt-8 space-y-6">
            {data.ipv4Addresses?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black/60 mb-3">IPv4 Adressen</h3>
                <div className="space-y-2">
                  {data.ipv4Addresses.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded-xl p-4 border border-black/[0.03]"
                    >
                      <code className="font-mono text-black">{ip}</code>
                      <CopyButton text={ip} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.ipv6Addresses?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black/60 mb-3">IPv6 Adressen</h3>
                <div className="space-y-2">
                  {data.ipv6Addresses.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded-xl p-4 border border-black/[0.03]"
                    >
                      <code className="font-mono text-black">{ip}</code>
                      <CopyButton text={ip} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DnsOverview;
