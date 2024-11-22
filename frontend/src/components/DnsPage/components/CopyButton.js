import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={`
          relative inline-flex items-center justify-center p-2 rounded-lg
          transition-all duration-200
          ${copied 
            ? 'bg-green-500 text-white' 
            : 'bg-gradient-to-b from-black/[0.02] to-black/[0.04] text-black/60 hover:text-black'
          }
          hover:-translate-y-0.5 hover:shadow-lg
          border border-black/[0.03] backdrop-blur-xl
          ${className}
        `}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}

        {/* Tooltip */}
        <div className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
          text-xs font-medium text-white bg-black rounded-lg
          transition-all duration-200
          ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}
        `}>
          Kopiert!
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
        </div>
      </button>

      {/* Hover effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-black/[0.03] to-black/[0.02] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur" />
    </div>
  );
};

export default CopyButton;
