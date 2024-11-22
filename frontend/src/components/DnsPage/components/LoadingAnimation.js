import React from 'react';

const LoadingAnimation = ({ queryTypes = [] }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-72 bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl shadow-lg border border-black/[0.03] backdrop-blur-xl overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        {/* Subtle light effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
      </div>

      {/* Spinning DNS icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-full blur-xl"></div>
          <div className="relative z-10 w-full h-full animate-spin-slow">
            <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-full"></div>
            <svg viewBox="0 0 24 24" className="w-full h-full text-black">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Query types ring */}
      <div className="absolute inset-0">
        {queryTypes.map((type, index) => {
          const angle = (360 / queryTypes.length) * index;
          const radius = 100;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <div
              key={type}
              className="absolute top-1/2 left-1/2 transition-all duration-500"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) ${index * 0.3}s infinite`
              }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <div className="relative px-3 py-1.5 bg-white rounded-xl shadow-sm border border-black/[0.03] backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
                  <span className="text-sm font-medium text-black/70 group-hover:text-black">
                    {type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading text and dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-base font-medium text-black/70 mb-3">
          DNS Abfragen werden durchgeführt
        </div>
        <div className="flex items-center justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-black"
              style={{
                animation: `bounce 1.4s cubic-bezier(0.8, 0, 1, 1) ${i * 0.16}s infinite`,
                opacity: 0.2 + (i * 0.2)
              }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(calc(-50% + ${props => props.x}px), calc(-50% + ${props => props.y}px)) scale(1);
          }
          50% {
            opacity: .85;
            transform: translate(calc(-50% + ${props => props.x}px), calc(-50% + ${props => props.y}px)) scale(0.97);
          }
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}} />
    </div>
  );
};

export default LoadingAnimation;
