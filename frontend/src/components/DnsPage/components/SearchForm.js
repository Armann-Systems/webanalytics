import React from 'react';
import { Search, AlertTriangle } from 'lucide-react';

const SearchForm = ({ 
  domain, 
  setDomain, 
  handleSearch, 
  isLoading, 
  error 
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            {/* Input with icon */}
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Domain eingeben (z.B. example.com)"
              className="w-full px-4 py-3 pl-12 rounded-xl border border-black/[0.03] bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-colors shadow-sm"
              required
              disabled={isLoading}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!domain || isLoading}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-all duration-200 font-medium disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0"
          >
            {isLoading ? 'Lädt...' : 'Alle Abfragen'}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text */}
      <p className="mt-3 text-sm text-black/60 text-center">
        Geben Sie eine Domain ein, um DNS Records, Mail-Server Konfiguration und mehr zu analysieren.
      </p>
    </div>
  );
};

export default SearchForm;
