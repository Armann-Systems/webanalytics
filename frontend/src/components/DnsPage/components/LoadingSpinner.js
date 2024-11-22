import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        {/* Background blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-full blur-xl"></div>
        
        {/* Spinner */}
        <div className="relative">
          <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
