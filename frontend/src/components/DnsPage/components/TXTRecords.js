import React from 'react';
import RecordSection from './RecordSection';
import { FileText, Tag, Hash } from 'lucide-react';
import CopyButton from './CopyButton';

const CategoryBadge = ({ category, type }) => {
  const colors = {
    'VERIFICATION': 'bg-blue-50 text-blue-600 border-blue-100',
    'EMAIL': 'bg-green-50 text-green-600 border-green-100',
    'CUSTOM': 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded-full border ${colors[category] || colors.CUSTOM}`}>
        {category || 'UNKNOWN'}
      </span>
      {type && (
        <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
          {type}
        </span>
      )}
    </div>
  );
};

const TXTRecords = ({ data, isLoading }) => {
  const renderContent = () => {
    if (!data?.records?.length) {
      return (
        <div className="bg-amber-50 text-amber-600 p-4 rounded-xl border border-amber-100">
          <p className="font-medium">Keine TXT Records gefunden</p>
          <p className="text-sm mt-1">Diese Domain hat keine TXT Records konfiguriert.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {data.records.map((record, index) => (
          <div key={index} className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] p-6 rounded-xl border border-black/[0.03]">
            {/* Header with Category and Type */}
            <div className="flex justify-between items-center mb-4">
              <CategoryBadge category={record.category} type={record.type} />
              {record.length && (
                <div className="flex items-center gap-2 text-sm text-black/60">
                  <Hash className="w-4 h-4" />
                  <span>{record.length} characters</span>
                </div>
              )}
            </div>

            {/* Record Content */}
            <div className="bg-white p-4 rounded-lg border border-black/[0.03] flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-black/60" />
                  <span className="font-medium">Record</span>
                </div>
                <div className="font-mono text-sm break-all">
                  {record.record || 'No content'}
                </div>
              </div>
              {record.record && <CopyButton text={record.record} className="flex-shrink-0" />}
            </div>

            {/* Additional Info for Verification Records */}
            {record.category === 'VERIFICATION' && (
              <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600">
                    {record.type === 'GOOGLE' ? 'Google Site Verification' : 
                     record.type === 'MICROSOFT' ? 'Microsoft Domain Verification' :
                     'Domain Verification Record'}
                  </span>
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
      title="TXT Records"
      data={data}
      isLoading={isLoading}
      metrics={data?.queryMetrics}
    >
      {renderContent()}
    </RecordSection>
  );
};

export default TXTRecords;
