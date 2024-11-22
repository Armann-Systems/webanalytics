import React from 'react';
import QueryMetrics from './QueryMetrics';
import LoadingSpinner from './LoadingSpinner';

const RecordSection = ({ 
  title,
  children,
  data, 
  isLoading, 
  error,
  metrics 
}) => {
  if (!data && !isLoading && !error) return null;

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      {metrics && !isLoading && !error && (
        <QueryMetrics metrics={data} />
      )}

      {/* Record Content */}
      <div className="bg-white rounded-xl border border-black/[0.03] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.03] bg-gradient-to-b from-black/[0.01] to-black/[0.02]">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            children
          )}
        </div>
      </div>

      {/* API Reference */}
      {!isLoading && !error && data && (
        <div className="bg-black/[0.02] rounded-xl p-4 text-sm text-black/60">
          <p>
            Diese Daten sind auch über unsere API verfügbar. Siehe die{' '}
            <a 
              href="/api#dns"
              className="text-black hover:underline font-medium"
            >
              API Dokumentation
            </a>
            {' '}für mehr Details.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordSection;
