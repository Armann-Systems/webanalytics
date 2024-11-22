import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Search, AlertTriangle } from 'lucide-react';
import SslService from '../../api/services/SslService';
import SslOverview from './components/SslOverview';
import CertificateDetails from './components/CertificateDetails';
import TlsAnalysis from './components/TlsAnalysis';
import ExpiryInfo from './components/ExpiryInfo';
import QueryMetrics from '../DnsPage/components/QueryMetrics';
import LoadingAnimation from '../DnsPage/components/LoadingAnimation';

const SslPage = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState({
    check: false,
    expiry: false
  });
  const [results, setResults] = useState({
    check: null,
    expiry: null
  });
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!domain || isAnyLoading) return;

    setLoading({ check: true, expiry: true });
    setError(null);
    setHasSearched(true);
    
    try {
      const [checkResponse, expiryResponse] = await Promise.all([
        SslService.checkCertificate(domain),
        SslService.checkExpiry(domain)
      ]);
      
      setResults({
        check: checkResponse.data,
        expiry: expiryResponse.data
      });
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading({ check: false, expiry: false });
    }
  };

  const isAnyLoading = Object.values(loading).some(Boolean);
  const loadingQueries = Object.entries(loading)
    .filter(([_, isLoading]) => isLoading)
    .map(([type]) => type === 'check' ? 'SSL Details' : 'Ablaufprüfung');

  return (
    <>
      <Helmet>
        <title>SSL Zertifikat Check | TLS & Verschlüsselung prüfen</title>
        <meta name="description" content="Kostenloser SSL Zertifikat Check und TLS Analyse. Überprüfen Sie SSL/TLS Konfiguration, Zertifikatsgültigkeit und Verschlüsselungssicherheit. Professionelles SSL Test Tool für Unternehmen." />
        <meta name="keywords" content="SSL Check, TLS Test, SSL Zertifikat prüfen, SSL Scanner, TLS Analyse, Zertifikat Ablauf, HTTPS Check, SSL Security, Verschlüsselung Test, SSL Validator" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/ssl" />
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
              <ShieldCheck className="w-10 h-10 text-black" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">SSL/TLS Analyse</h1>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">
              Analysiere SSL/TLS Zertifikate und überprüfe die Sicherheitskonfiguration
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="mb-6">
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
                  disabled={!domain || isAnyLoading}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-all duration-200 font-medium disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {isAnyLoading ? 'Lädt...' : 'Analysieren'}
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
          {isAnyLoading && (
            <div className="mb-8">
              <LoadingAnimation queryTypes={loadingQueries} />
            </div>
          )}

          {/* Initial Instructions */}
          {!hasSearched && !isAnyLoading && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8 border border-black/[0.03] backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">SSL/TLS Analyse Werkzeug</h2>
                <p className="text-black/60 mb-8 text-lg">
                  Mit diesem Tool können Sie umfassende SSL/TLS-Analysen durchführen:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-black/[0.03]">
                    <h3 className="text-lg font-semibold mb-4">Verfügbare Analysen</h3>
                    <ul className="space-y-3">
                      {[
                        'Zertifikatsdetails',
                        'Gültigkeitszeitraum',
                        'Alternative Namen (SAN)',
                        'TLS Protokoll Support'
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
                        'Sicherheitsbewertung',
                        'Cipher Suites',
                        'Performance-Analyse',
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
          {!isAnyLoading && results.check && results.expiry && (
            <div className="space-y-8">
              {/* Overview Section */}
              <SslOverview data={results.check} />

              {/* Expiry Information */}
              <ExpiryInfo data={results.expiry} />

              {/* TLS Analysis */}
              <TlsAnalysis tlsSupport={results.check.tlsSupport} />

              {/* Certificate Details */}
              {results.check.certificates.map((cert, index) => (
                <CertificateDetails key={index} certificate={cert} />
              ))}

              {/* Query Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QueryMetrics
                  metrics={results.check.queryMetrics}
                  title="SSL Check Metriken"
                />
                <QueryMetrics
                  metrics={results.expiry.queryMetrics}
                  title="Expiry Check Metriken"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SslPage;
