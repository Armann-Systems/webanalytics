import React, { useState } from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const SearchForm = ({ onSearch, loading }) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain) return;
    onSearch(domain);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Domain eingeben (z.B. example.com)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
              required
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <InfoTooltip
                title="Domain Format"
                content="Geben Sie eine Domain ohne Protokoll ein (z.B. example.com)"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!domain || loading}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Lädt...' : 'Analysieren'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
