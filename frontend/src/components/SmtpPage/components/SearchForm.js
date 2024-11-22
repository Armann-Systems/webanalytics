import React, { useState } from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';

const SearchForm = ({ onSearch, loading }) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Domain eingeben (z.B. example.com)"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!domain || loading}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Lädt...' : 'Analysieren'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
