import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe, Search, AlertTriangle } from 'lucide-react';
import DnsService from '../../api/services/DnsService';
import DnsOverview from './components/DnsOverview';
import NameserverSection from './components/NameserverSection';
import PropagationSection from './components/PropagationSection';
import QueryButton from './components/QueryButton';
import LoadingAnimation from './components/LoadingAnimation';
import MXRecords from './components/MXRecords';
import TXTRecords from './components/TXTRecords';
import SPFRecords from './components/SPFRecords';
import DMARCRecords from './components/DMARCRecords';

const QUERY_TYPE_LABELS = {
  overview: 'Basic DNS',
  mx: 'MX',
  txt: 'TXT',
  spf: 'SPF',
  dmarc: 'DMARC'
};

const DnsPage = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState({
    overview: false,
    mx: false,
    txt: false,
    spf: false,
    dmarc: false
  });
  const [results, setResults] = useState({
    overview: null,
    mx: null,
    txt: null,
    spf: null,
    dmarc: null
  });
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const isAnyLoading = Object.values(loading).some(Boolean);
  const loadingQueries = Object.entries(loading)
    .filter(([_, isLoading]) => isLoading)
    .map(([type]) => QUERY_TYPE_LABELS[type]);

  const validateDomain = (domain) => {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleQuery = async (queryType) => {
    if (!domain || !validateDomain(domain)) {
      setError('Bitte geben Sie eine gültige Domain ein (z.B. example.com)');
      return;
    }

    if (isAnyLoading) return;

    setError(null);
    setLoading(prev => ({ ...prev, [queryType]: true }));
    setHasSearched(true);

    try {
      let result;
      switch (queryType) {
        case 'overview':
          result = await DnsService.lookup(domain);
          break;
        case 'mx':
          result = await DnsService.getMXRecords(domain);
          break;
        case 'txt':
          result = await DnsService.getTXTRecords(domain);
          break;
        case 'spf':
          result = await DnsService.getSPFRecords(domain);
          break;
        case 'dmarc':
          result = await DnsService.getDMARCRecords(domain);
          break;
        default:
          break;
      }
      setResults(prev => ({ ...prev, [queryType]: result.data }));
    } catch (err) {
      setError(`Fehler beim Abrufen von ${QUERY_TYPE_LABELS[queryType]}: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [queryType]: false }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (isAnyLoading) return;

    if (!domain || !validateDomain(domain)) {
      setError('Bitte geben Sie eine gültige Domain ein (z.B. example.com)');
      return;
    }

    handleQuery('overview');
    handleQuery('mx');
    handleQuery('txt');
    handleQuery('spf');
    handleQuery('dmarc');
  };

  return (
    <>
      <Helmet>
        <title>DNS Analyse Tool | DNS Records & MX Einträge prüfen</title>
        <meta name="description" content="Kostenlose DNS Analyse für alle Record-Typen: MX, TXT, SPF, DMARC. Überprüfen Sie DNS Einträge, Nameserver und DNS-Propagation. Professionelles DNS-Tool für Unternehmen." />
        <meta name="keywords" content="DNS Analyse, DNS Records prüfen, MX Einträge, SPF Check, DMARC Analyse, DNS Propagation, Nameserver Check, DNS Tool, DNS Lookup, DNS Test" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/dns" />
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
              <Globe className="w-10 h-10 text-black" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">DNS Analyse</h1>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">
              Analysiere DNS Records und überprüfe die DNS Konfiguration
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <form onSubmit={handleSearch} className="mb-6 relative z-20">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="Domain eingeben (z.B. example.com)"
                      className="w-full px-4 py-3 pl-12 rounded-xl border border-black/[0.03] bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-colors shadow-sm"
                      required
                      disabled={isAnyLoading}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                  </div>
                  <button
                    type="submit"
                    disabled={isAnyLoading}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-all duration-200 font-medium disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {isAnyLoading ? 'Lädt...' : 'Alle Abfragen'}
                  </button>
                </div>
              </form>

              {/* Individual Query Buttons */}
              {(hasSearched || domain) && (
                <div className="flex flex-wrap gap-3 relative z-10">
                  <QueryButton
                    label="Basic DNS"
                    onClick={() => handleQuery('overview')}
                    isLoading={loading.overview}
                    isActive={results.overview !== null}
                    disabled={isAnyLoading}
                    infoTitle="Basic DNS Abfrage"
                    infoContent="Ruft grundlegende DNS-Informationen wie A, AAAA, NS und SOA Records ab."
                  />
                  <QueryButton
                    label="Mail (MX)"
                    onClick={() => handleQuery('mx')}
                    isLoading={loading.mx}
                    isActive={results.mx !== null}
                    disabled={isAnyLoading}
                    infoTitle="Mail Exchange Records"
                    infoContent="Überprüft die Mailserver-Konfiguration und testet die Erreichbarkeit."
                  />
                  <QueryButton
                    label="TXT Records"
                    onClick={() => handleQuery('txt')}
                    isLoading={loading.txt}
                    isActive={results.txt !== null}
                    disabled={isAnyLoading}
                    infoTitle="TXT Records"
                    infoContent="Zeigt alle TXT Records an, einschließlich Verifizierungen und E-Mail-Authentifizierung."
                  />
                  <QueryButton
                    label="SPF"
                    onClick={() => handleQuery('spf')}
                    isLoading={loading.spf}
                    isActive={results.spf !== null}
                    disabled={isAnyLoading}
                    infoTitle="Sender Policy Framework"
                    infoContent="Analysiert die SPF-Konfiguration für E-Mail-Authentifizierung."
                  />
                  <QueryButton
                    label="DMARC"
                    onClick={() => handleQuery('dmarc')}
                    isLoading={loading.dmarc}
                    isActive={results.dmarc !== null}
                    disabled={isAnyLoading}
                    infoTitle="DMARC Policy"
                    infoContent="Überprüft die DMARC-Policy für erweiterte E-Mail-Authentifizierung."
                  />
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Loading Animation */}
          {isAnyLoading && (
            <div className="mb-8">
              <LoadingAnimation queryTypes={loadingQueries} />
            </div>
          )}

          {/* Initial Instructions */}
          {!hasSearched && !isAnyLoading && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8 border border-black/[0.03] backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">DNS Analyse Werkzeug</h2>
                <p className="text-black/60 mb-8 text-lg">
                  Mit diesem Tool können Sie umfassende DNS-Analysen durchführen:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-black/[0.03]">
                    <h3 className="text-lg font-semibold mb-4">Verfügbare Analysen</h3>
                    <ul className="space-y-3">
                      {[
                        'Basic DNS (A, AAAA, NS Records)',
                        'Mail Server Konfiguration (MX)',
                        'TXT Records und Verifizierungen',
                        'E-Mail Sicherheit (SPF, DMARC)'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-black/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-black/[0.03]">
                    <h3 className="text-lg font-semibold mb-4">Features</h3>
                    <ul className="space-y-3">
                      {[
                        'Performance-Analyse',
                        'Propagations-Check',
                        'Sicherheitsüberprüfung',
                        'Best-Practice Empfehlungen'
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

          {/* Results */}
          {hasSearched && !isAnyLoading && (
            <div className="space-y-8">
              {results.overview && (
                <>
                  <DnsOverview data={results.overview} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NameserverSection nameservers={results.overview.authoritativeNameservers} />
                    <PropagationSection propagation={results.overview.propagation} />
                  </div>
                </>
              )}

              {/* Record Components */}
              <div className="space-y-6">
                {(results.mx || loading.mx) && (
                  <MXRecords data={results.mx} isLoading={loading.mx} />
                )}

                {(results.txt || loading.txt) && (
                  <TXTRecords data={results.txt} isLoading={loading.txt} />
                )}

                {(results.spf || loading.spf) && (
                  <SPFRecords data={results.spf} isLoading={loading.spf} />
                )}

                {(results.dmarc || loading.dmarc) && (
                  <DMARCRecords data={results.dmarc} isLoading={loading.dmarc} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DnsPage;
