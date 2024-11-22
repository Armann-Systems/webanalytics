import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldBan, Search, AlertTriangle } from 'lucide-react';
import BlacklistService from '../../api/services/BlacklistService';
import LoadingAnimation from '../DnsPage/components/LoadingAnimation';
import SummaryCard from './components/SummaryCard';
import InfrastructureSection from './components/InfrastructureSection';
import BlacklistResults from './components/BlacklistResults';

const BlacklistPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const validateInput = (input) => {
    // IP regex pattern
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    // Domain regex pattern
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
    return {
      isValid: ipRegex.test(input) || domainRegex.test(input),
      type: ipRegex.test(input) ? 'ip' : domainRegex.test(input) ? 'domain' : null
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validation = validateInput(query);
    if (!validation.isValid) {
      setError('Bitte geben Sie eine gültige IP-Adresse oder Domain ein');
      return;
    }

    setError(null);
    setLoading(true);
    setHasSearched(true);

    try {
      const result = validation.type === 'ip' 
        ? await BlacklistService.checkIP(query)
        : await BlacklistService.checkDomain(query);
      
      setResults(result.data);
    } catch (err) {
      setError(`Fehler bei der Blacklist-Überprüfung: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Blacklist Prüfung | IP & Domain Reputation Check</title>
        <meta name="description" content="Kostenlose Blacklist-Prüfung für IP-Adressen und Domains. Überprüfen Sie Mail-Server auf Spam-Blacklists und RBL. Umfassende IP-Reputation Analyse für Unternehmen." />
        <meta name="keywords" content="Blacklist Prüfung, IP Reputation, RBL Check, Spam Blacklist, Domain Blacklist, Mail Server Check, IP Blacklist, DNSBL, Email Reputation, Anti-Spam" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/blacklist" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 relative py-16">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-black/[0.02] to-black/[0.04] mb-6">
              <ShieldBan className="w-10 h-10 text-black" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Blacklist Prüfung</h1>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">
              Überprüfen Sie IP-Adressen und Domains auf Blacklist-Einträge
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="IP oder Domain eingeben (z.B. 1.2.3.4 oder example.com)"
                    className="w-full px-4 py-3 pl-12 rounded-xl border border-black/[0.03] bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-colors shadow-sm"
                    required
                    disabled={loading}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                </div>
                <button
                  type="submit"
                  disabled={!query || loading}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-all duration-200 font-medium disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {loading ? 'Lädt...' : 'Analysieren'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="mb-8">
              <LoadingAnimation queryTypes={['Blacklist Check']} />
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div className="space-y-8">
              <SummaryCard data={results} />
              {results.relatedRecords && (
                <InfrastructureSection data={results} />
              )}
              <BlacklistResults data={results} />
            </div>
          )}

          {/* Initial Instructions */}
          {!hasSearched && !loading && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8 border border-black/[0.03] backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">Blacklist Prüfungs-Tool</h2>
                <p className="text-black/60 mb-8 text-lg">
                  Überprüfen Sie IP-Adressen und Domains auf Einträge in verschiedenen Blacklists:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-black/[0.03]">
                    <h3 className="text-lg font-semibold mb-4">Features</h3>
                    <ul className="space-y-3">
                      {[
                        'Prüfung mehrerer Blacklist-Provider',
                        'Detaillierte Risikobewertung',
                        'Performance-Metriken',
                        'Reverse DNS Lookup'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-black/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-black/[0.03]">
                    <h3 className="text-lg font-semibold mb-4">Unterstützte Prüfungen</h3>
                    <ul className="space-y-3">
                      {[
                        'IP-Adressen (IPv4)',
                        'Domains und Subdomains',
                        'Mail-Server IPs',
                        'Hosting-Provider'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-black/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlacklistPage;
