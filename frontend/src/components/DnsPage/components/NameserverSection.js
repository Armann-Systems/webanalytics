import React from 'react';
import { Server, Check, Clock, Shield, Globe, AlertTriangle } from 'lucide-react';
import CopyButton from './CopyButton';

const NameserverSection = ({ nameservers = [] }) => {
  if (!nameservers?.length) return null;

  const operationalCount = nameservers.filter(ns => ns.status === 'operational').length;
  const avgResponseTime = nameservers
    .filter(ns => ns.responseTime)
    .reduce((acc, curr, idx, arr) => acc + curr.responseTime / arr.length, 0);

  const getProviderCount = () => {
    const providers = new Set(nameservers.map(ns => ns.provider).filter(Boolean));
    return providers.size;
  };

  return (
    <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl border border-black/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
            <Server className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-lg font-semibold text-black">Nameserver</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-sm font-medium text-black/60 bg-black/5 rounded-lg">
            {nameservers.length} Server
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Operational Status */}
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Globe className="w-5 h-5 text-black" />
              </div>
              {operationalCount === nameservers.length ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <p className="text-sm font-medium text-black/60">Status</p>
            <p className="text-lg font-semibold text-black">
              {operationalCount}/{nameservers.length} Aktiv
            </p>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Clock className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="text-sm font-medium text-black/60">Response Time</p>
            <p className="text-lg font-semibold text-black">
              {avgResponseTime ? `${Math.round(avgResponseTime)}ms` : 'N/A'}
            </p>
          </div>

          {/* Provider Info */}
          <div className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04]">
                <Shield className="w-5 h-5 text-black" />
              </div>
            </div>
            <p className="text-sm font-medium text-black/60">DNS Provider</p>
            <p className="text-lg font-semibold text-black">
              {getProviderCount()} Provider
            </p>
          </div>
        </div>

        {/* Nameserver List */}
        <div className="space-y-3">
          {nameservers.map((ns, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-black/[0.03] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {ns.status === 'operational' ? (
                      <div className="p-1.5 rounded-lg bg-green-50">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-yellow-50">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                    <span className="px-2.5 py-1 text-sm font-medium text-black/60 bg-black/5 rounded-lg">
                      {ns.provider || 'Unknown Provider'}
                    </span>
                    {ns.responseTime && (
                      <span className="text-sm text-black/40">
                        {Math.round(ns.responseTime)}ms
                      </span>
                    )}
                  </div>
                  <code className="font-mono text-black">{ns.nameserver}</code>
                  {ns.ip && (
                    <p className="mt-1 text-sm text-black/40">
                      IP: {ns.ip}
                    </p>
                  )}
                  {ns.error && (
                    <p className="mt-2 text-sm text-red-600">
                      Error: {ns.error}
                    </p>
                  )}
                </div>
                <CopyButton text={ns.nameserver} />
              </div>
            </div>
          ))}
        </div>

        {/* Info Text */}
        <p className="text-sm text-black/60 bg-black/[0.02] rounded-xl p-4">
          Nameserver sind für die Auflösung von Domainnamen in IP-Adressen zuständig. 
          Eine gute DNS-Konfiguration sollte mehrere aktive Nameserver von verschiedenen Providern haben.
        </p>
      </div>
    </div>
  );
};

export default NameserverSection;
