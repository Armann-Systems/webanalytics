import React from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const SearchForm = ({ query, setQuery, loading, onSubmit }) => {
  return (
    <div className="max-w-3xl mx-auto mb-12">
      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="IP-Adresse oder Domain eingeben"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
              required
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <InfoTooltip
                title="Eingabeformat"
                content={
                  <div className="space-y-2">
                    <p>Unterstützte Formate:</p>
                    <ul className="list-disc list-inside">
                      <li>IP-Adresse (z.B. 8.8.8.8)</li>
                      <li>Domain (z.B. example.com)</li>
                    </ul>
                  </div>
                }
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!query || loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Lädt...' : 'Prüfen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
