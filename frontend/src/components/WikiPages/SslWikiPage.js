import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Check, ArrowRight, AlertTriangle, Terminal, Lock, Clock, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const SslWikiPage = () => {
  return (
    <>
      <Helmet>
        <title>SSL/TLS Best Practices & Zertifikats-Guide | SSL Checker</title>
        <meta name="description" content="Umfassender Guide für SSL/TLS-Konfiguration, Zertifikatsmanagement und Sicherheitsoptimierung. Mit praktischen Beispielen und direktem Zugang zu SSL-Test-Tools." />
        <meta name="keywords" content="SSL Guide, TLS Best Practices, SSL Zertifikat, HTTPS Setup, SSL Testing, SSL API, SSL Check" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/wiki/ssl" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/5 mb-6">
            <Shield className="w-10 h-10 text-black" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            SSL/TLS Guide & Best Practices
          </h1>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Lernen Sie alles über sichere SSL/TLS-Konfiguration, Zertifikatsmanagement und bewährte Sicherheitspraktiken.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/ssl"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white hover:bg-black/90 transition-all duration-200"
            >
              <Terminal className="w-5 h-5 mr-2" />
              SSL Checker öffnen
            </Link>
            <Link
              to="/api#ssl"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-black/10 hover:bg-black/5 transition-all duration-200"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              API Dokumentation
            </Link>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-black/5 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Schnellnavigation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Zertifikats-Check', href: '#certificate-check', icon: Shield },
              { title: 'TLS Konfiguration', href: '#tls-config', icon: Lock },
              { title: 'Ablaufüberwachung', href: '#expiry-monitoring', icon: Clock },
              { title: 'Sicherheitstests', href: '#security-tests', icon: Terminal },
              { title: 'Fehlerbehebung', href: '#troubleshooting', icon: AlertTriangle },
              { title: 'API Integration', href: '#api-integration', icon: Code }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Certificate Check Section */}
        <section id="certificate-check" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">SSL Zertifikats-Check</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Best Practices</h3>
              <ul className="space-y-4">
                {[
                  'Verwenden Sie mindestens 2048-bit RSA oder ECC Zertifikate',
                  'Implementieren Sie automatische Zertifikatserneuerung',
                  'Überwachen Sie die Ablaufdaten aller Zertifikate',
                  'Stellen Sie sicher, dass die komplette Zertifikatskette gültig ist'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                    <span className="text-black/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/ssl?test=certificate"
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  Zertifikat jetzt prüfen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="bg-black/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">API Integration</h3>
              <p className="text-black/70 mb-4">
                Automatisierte Zertifikatsprüfung über unsere API:
              </p>
              <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                {`GET /ssl/check?domain=example.com
X-API-Key: your-api-key

Response:
{
  "valid": true,
  "expires": "2024-12-31",
  "issuer": "Let's Encrypt",
  "keyStrength": "2048 bit",
  "sans": ["example.com", "www.example.com"]
}`}
              </pre>
              <Link
                to="/api#ssl-check"
                className="inline-flex items-center mt-4 text-sm font-medium hover:underline"
              >
                Zur API Dokumentation
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* TLS Configuration Section */}
        <section id="tls-config" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">TLS Konfiguration</h2>
          <div className="bg-black text-white rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Empfohlene Einstellungen</h3>
                <ul className="space-y-4">
                  {[
                    'TLS 1.2 und 1.3 aktivieren, ältere Versionen deaktivieren',
                    'Sichere Cipher Suites priorisieren',
                    'Perfect Forward Secrecy (PFS) aktivieren',
                    'HTTP Strict Transport Security (HSTS) implementieren'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Validierung</h3>
                <p className="text-white/80 mb-4">
                  Überprüfen Sie Ihre TLS-Konfiguration mit unserem SSL-Checker:
                </p>
                <pre className="bg-white/10 text-white p-4 rounded-lg overflow-x-auto">
                  {`GET /ssl/validate?domain=example.com
X-API-Key: your-api-key

Prüft:
- TLS Versionen
- Cipher Suites
- Zertifikatskette
- HSTS Konfiguration`}
                </pre>
                <Link
                  to="/ssl?test=tls"
                  className="inline-flex items-center mt-4 text-sm font-medium text-white hover:underline"
                >
                  TLS-Konfiguration testen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Expiry Monitoring Section */}
        <section id="expiry-monitoring" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Ablaufüberwachung</h2>
          <div className="bg-black/5 rounded-2xl p-8">
            <p className="text-lg text-black/70 mb-6">
              Automatisieren Sie die Überwachung Ihrer SSL-Zertifikate:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">API Endpoint</h3>
                <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                  {`GET /ssl/expiry?domain=example.com
X-API-Key: your-api-key

Response:
{
  "expiryDate": "2024-12-31",
  "daysRemaining": 180,
  "status": "valid",
  "renewalRecommended": false
}`}
                </pre>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Empfehlungen</h3>
                <ul className="space-y-4">
                  {[
                    'Erneuern Sie Zertifikate spätestens 30 Tage vor Ablauf',
                    'Implementieren Sie automatische Benachrichtigungen',
                    'Nutzen Sie unsere API für automatisches Monitoring',
                    'Dokumentieren Sie alle Zertifikate und Ablaufdaten'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <span className="text-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* API Integration Section */}
        <section id="api-integration" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">API Integration</h2>
          <div className="bg-black/5 rounded-2xl p-8">
            <p className="text-lg text-black/70 mb-6">
              Integrieren Sie unsere SSL-Test-Capabilities in Ihre eigene Anwendung:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Verfügbare Endpoints</h3>
                <ul className="space-y-4">
                  {[
                    { path: '/ssl/check?domain=example.com', desc: 'Basis SSL Check' },
                    { path: '/ssl/expiry?domain=example.com', desc: 'Ablaufdatum prüfen' },
                    { path: '/ssl/validate?domain=example.com', desc: 'Vollständige Validierung' }
                  ].map((endpoint, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Terminal className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <div>
                        <code className="font-mono text-sm bg-black/10 px-2 py-1 rounded">{endpoint.path}</code>
                        <p className="text-sm text-black/70 mt-1">{endpoint.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Beispiel-Integration</h3>
                <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                  {`const response = await fetch(
  'https://api.webanalytics.com/ssl/check?domain=example.com', {
  headers: {
    'x-api-key': 'your-api-key'
  }
});

const data = await response.json();`}
                </pre>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/api#ssl"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white hover:bg-black/90 transition-all duration-200"
              >
                <Terminal className="w-5 h-5 mr-2" />
                Komplette API Dokumentation
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SslWikiPage;
