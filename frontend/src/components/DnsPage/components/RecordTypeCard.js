import React from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

const RecordTypeCard = ({ title, type, records = [], error = null, children }) => {
  const hasRecords = records && records.length > 0;

  // Ensure records are properly stringified if they're objects
  const processedRecords = records.map(record => {
    if (typeof record === 'string') return record;
    return record.raw || record.value || JSON.stringify(record);
  });

  return (
    <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl border border-black/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-black/[0.03]">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          {hasRecords && (
            <span className="px-2.5 py-1 text-sm font-medium text-black/60 bg-black/5 rounded-lg">
              {processedRecords.length} {processedRecords.length === 1 ? 'Record' : 'Records'}
            </span>
          )}
        </div>
        <ChevronDown className="w-5 h-5 text-black/40" />
      </div>

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : !hasRecords ? (
          <div className="flex items-start gap-3 p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>Keine {type} Records gefunden</span>
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordTypeCard;
