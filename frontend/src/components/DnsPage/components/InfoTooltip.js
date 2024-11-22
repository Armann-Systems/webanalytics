import React from 'react';

const InfoTooltip = ({ title, content }) => {
  return (
    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute left-full ml-2 z-50">
      <div className="w-64 bg-white rounded-xl shadow-lg border border-black/[0.03] backdrop-blur-xl overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.04] pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative p-4">
          {title && (
            <h4 className="text-sm font-semibold text-black mb-2">
              {title}
            </h4>
          )}
          <p className="text-sm text-black/70">
            {content}
          </p>
        </div>

        {/* Arrow */}
        <div className="absolute -left-2 top-4">
          <div className="relative w-2 h-2 rotate-45 bg-white border-l border-t border-black/[0.03]"></div>
        </div>

        {/* Subtle light effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default InfoTooltip;
