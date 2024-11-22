import React from 'react';
import { Info, Loader } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const QueryButton = ({ 
  label, 
  onClick, 
  isLoading, 
  isActive, 
  disabled,
  infoTitle,
  infoContent 
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
          ${isActive 
            ? 'bg-black text-white hover:bg-black/90' 
            : 'bg-gradient-to-b from-black/[0.02] to-black/[0.04] text-black/70 hover:text-black hover:from-black/[0.03] hover:to-black/[0.06]'
          }
          ${!disabled && !isLoading && 'hover:-translate-y-0.5 hover:shadow-lg'}
          ${disabled && 'opacity-50 cursor-not-allowed'}
          border border-black/[0.03] backdrop-blur-xl
        `}
      >
        {isLoading ? (
          <Loader className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {label}
        {infoTitle && infoContent && (
          <div className="ml-2 relative">
            <Info className="w-4 h-4 text-current opacity-60" />
            <div className="absolute top-0 left-full ml-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
              <InfoTooltip title={infoTitle} content={infoContent} />
            </div>
          </div>
        )}
      </button>

      {/* Active indicator dot */}
      {isActive && !isLoading && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
      )}

      {/* Hover effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-black/[0.03] to-black/[0.02] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur" />
    </div>
  );
};

export default QueryButton;
