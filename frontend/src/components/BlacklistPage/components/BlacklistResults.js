import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';
import CopyButton from '../../DnsPage/components/CopyButton';

const BlacklistResults = ({ data }) => {
  if (!data) return null;
  
  const isDomainCheck = Boolean(data.domain);

  const renderProviderResult = (result) => {
    if (!result) return null;
    
    return (
      <div key={result.host} className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{result.provider}</h4>
              <InfoTooltip
                title={result.provider}
                content={result.description || 'Blacklist Provider'}
              />
            </div>
            <p className="text-sm text-gray-500">{result.host}</p>
          </div>
          <span className={`font-medium ${result.listed ? 'text-red-600' : 'text-green-600'}`}>
            {result.listed ? 'Gelistet' : 'Nicht gelistet'}
          </span>
        </div>
        <div className="mt-2 space-y-1 text-sm">
          {result.responseTimeMs !== undefined && (
            <div className="flex justify-between text-gray-600">
              <span>Antwortzeit:</span>
              <span>{Math.round(result.responseTimeMs)}ms</span>
            </div>
          )}
          {result.reliability && (
            <div className="flex justify-between text-gray-600">
              <span>Zuverlässigkeit:</span>
              <span>{result.reliability}/10</span>
            </div>
          )}
          {result.error && (
            <div className="text-yellow-600 flex items-center gap-1">
              <span>Hinweis:</span>
              <InfoTooltip
                title="Error Info"
                content={
                  <div>
                    <p>Der Provider konnte nicht erreicht werden:</p>
                    <p className="font-mono mt-1">{result.error}</p>
                  </div>
                }
              />
              <span>{result.error}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIPCheck = (ipDetail) => {
    if (!ipDetail) return null;

    return (
      <div key={ipDetail.ip} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">IP: {ipDetail.ip}</h3>
              <CopyButton text={ipDetail.ip} />
            </div>
            {ipDetail.networkInfo?.reverseDns && (
              <p className="text-sm text-gray-500">
                Reverse DNS: {ipDetail.networkInfo.reverseDns}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(ipDetail.results) && ipDetail.results.map(renderProviderResult)}
        </div>
      </div>
    );
  };

  if (isDomainCheck) {
    return (
      <div className="space-y-4">
        {Array.isArray(data.ipDetails) ? (
          data.ipDetails.map(renderIPCheck)
        ) : (
          <div className="text-gray-500">Keine Blacklist-Prüfungen verfügbar</div>
        )}
      </div>
    );
  }

  // Single IP check
  return renderIPCheck({
    ip: data.ip,
    results: Array.isArray(data.results) ? data.results : [],
    networkInfo: data.networkInfo
  });
};

export default BlacklistResults;
