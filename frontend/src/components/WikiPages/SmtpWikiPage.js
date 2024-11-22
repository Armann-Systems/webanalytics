import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Check, ArrowRight, AlertTriangle, Terminal, Shield, Server, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const SmtpWikiPage = () => {
  return (
    <>
      <Helmet>
        <title>SMTP Server Guide & Best Practices | E-Mail Server Testing</title>
        <meta name="description" content="Umfassender Guide für SMTP-Server Konfiguration, E-Mail-Diagnose und Sicherheitsoptimierung. Mit praktischen Beispielen und direktem Zugang zu SMTP-Test-Tools." />
        <meta name="keywords" content="SMTP Guide, E-Mail Server, SMTP Test, Mail Diagnostics, SMTP Security, SMTP API, Mail Server Setup" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/wiki/smtp" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/5 mb-6">
            <Mail className="w-10 h-10 text-black" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            SMTP Server Guide & Best Practices
          </h1>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Optimieren Sie Ihre E-Mail-Infrastruktur mit unserem umfassenden Guide zu SMTP-Konfiguration, Diagnose und Sicherheit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/smtp"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white hover:bg-black/90 transition-all duration-200"
            >
              <Terminal className="w-5 h-5 mr-2" />
              SMTP Tester öffnen
            </Link>
            <Link
              to="/api#smtp"
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
              { title: 'Server Test', href: '#server-test', icon: Server },
              { title: 'Diagnose', href: '#diagnostics', icon: Terminal },
              { title: 'Sicherheit', href: '#security', icon: Shield },
              { title: 'Fehlerbehebung', href: '#troubleshooting', icon: AlertTriangle },
              { title: 'Best Practices', href: '#best-practices', icon: Check },
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

        {/* Server Test Section */}
        <section id="server-test" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">SMTP Server Test</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Testumfang</h3>
              <ul className="space-y-4">
                {[
                  'Verbindungsaufbau und Handshake',
                  'STARTTLS Verfügbarkeit und Konfiguration',
                  'Authentifizierungsmethoden',
                  'Reverse DNS und PTR Records',
                  'Mailserver-Antwortzeiten'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                    <span className="text-black/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/smtp?test=server"
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  Server jetzt testen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="bg-black/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">API Integration</h3>
              <p className="text-black/70 mb-4">
                Automatisierte SMTP-Tests über unsere API:
              </p>
              <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                {`GET /smtp/test?domain=example.com
X-API-Key: your-api-key

Response:
{
  "connection": "success",
  "starttls": true,
  "auth_methods": ["PLAIN", "LOGIN"],
  "response_time": 150,
  "ptr_record": "mail.example.com"
}`}
              </pre>
              <Link
                to="/api#smtp-test"
                className="inline-flex items-center mt-4 text-sm font-medium hover:underline"
              >
                Zur API Dokumentation
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Diagnostics Section */}
        <section id="diagnostics" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">SMTP Diagnose</h2>
          <div className="bg-black text-white rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Diagnose-Tools</h3>
                <ul className="space-y-4">
                  {[
                    'Detaillierte SMTP-Kommunikation',
                    'TLS/SSL Zertifikatsprüfung',
                    'DNS Record Validierung',
                    'Blacklist-Status Check',
                    'Performance-Analyse'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">API Endpoint</h3>
                <pre className="bg-white/10 text-white p-4 rounded-lg overflow-x-auto">
                  {`GET /smtp/diagnostics?domain=example.com
X-API-Key: your-api-key

Liefert:
- SMTP Handshake Details
- SSL/TLS Status
- DNS Konfiguration
- Performance Metrics`}
                </pre>
                <Link
                  to="/smtp?test=diagnostics"
                  className="inline-flex items-center mt-4 text-sm font-medium text-white hover:underline"
                >
                  Diagnose durchführen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section id="best-practices" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Best Practices</h2>
          <div className="bg-black/5 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Sicherheit</h3>
                <ul className="space-y-4">
                  {[
                    'STARTTLS für verschlüsselte Verbindungen aktivieren',
                    'Sichere Authentifizierungsmethoden implementieren',
                    'Rate-Limiting gegen Brute-Force Angriffe',
                    'Regelmäßige Sicherheits-Audits durchführen'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <span className="text-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Performance</h3>
                <ul className="space-y-4">
                  {[
                    'Optimale Serverressourcen zuweisen',
                    'Queue-Management implementieren',
                    'Monitoring-System einrichten',
                    'Backup-MX Server konfigurieren'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Server className="w-5 h-5 text-black mt-1 flex-shrink-0" />
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
              Integrieren Sie unsere SMTP-Test-Capabilities in Ihre eigene Anwendung:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Verfügbare Endpoints</h3>
                <ul className="space-y-4">
                  {[
                    { path: '/smtp/test?domain=example.com', desc: 'Server Test durchführen' },
                    { path: '/smtp/diagnostics?domain=example.com', desc: 'Detaillierte Diagnose' }
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
  'https://api.webanalytics.com/smtp/test?domain=example.com', {
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
                to="/api#smtp"
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

export default SmtpWikiPage;
