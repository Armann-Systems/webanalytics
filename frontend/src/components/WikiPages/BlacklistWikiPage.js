import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, Check, ArrowRight, AlertTriangle, Terminal, Shield, Globe, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlacklistWikiPage = () => {
  return (
    <>
      <Helmet>
        <title>IP & Domain Blacklist Guide | Reputation Management</title>
        <meta name="description" content="Umfassender Guide für IP und Domain Blacklist-Prüfung, Reputation Management und Best Practices. Mit praktischen Beispielen und direktem Zugang zu Blacklist-Check-Tools." />
        <meta name="keywords" content="IP Blacklist, Domain Blacklist, Email Reputation, RBL Check, Spam Prevention, Blacklist API, Sender Score" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/wiki/blacklist" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/5 mb-6">
            <Activity className="w-10 h-10 text-black" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Blacklist Guide & Best Practices
          </h1>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Schützen Sie Ihre E-Mail-Reputation durch proaktives Monitoring und Best Practices für IP- und Domain-Reputation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/blacklist"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white hover:bg-black/90 transition-all duration-200"
            >
              <Terminal className="w-5 h-5 mr-2" />
              Blacklist Checker öffnen
            </Link>
            <Link
              to="/api#blacklist"
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
              { title: 'IP Check', href: '#ip-check', icon: Globe },
              { title: 'Domain Check', href: '#domain-check', icon: Shield },
              { title: 'Reputation', href: '#reputation', icon: Activity },
              { title: 'Prävention', href: '#prevention', icon: AlertTriangle },
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

        {/* IP Check Section */}
        <section id="ip-check" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">IP Blacklist Check</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Prüfungsumfang</h3>
              <ul className="space-y-4">
                {[
                  'Multi-RBL Überprüfung',
                  'Reverse DNS Validierung',
                  'IP Reputation Score',
                  'Geolocation Analyse',
                  'Historische Daten'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                    <span className="text-black/80">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  to="/blacklist?test=ip"
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  IP jetzt prüfen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="bg-black/5 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">API Integration</h3>
              <p className="text-black/70 mb-4">
                Automatisierte IP-Blacklist-Prüfung über unsere API:
              </p>
              <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                {`GET /blacklist/ip?ip=8.8.8.8
X-API-Key: your-api-key

Response:
{
  "listed": false,
  "blacklists": [],
  "reputation_score": 95,
  "reverse_dns": "dns.google"
}`}
              </pre>
              <Link
                to="/api#blacklist-ip"
                className="inline-flex items-center mt-4 text-sm font-medium hover:underline"
              >
                Zur API Dokumentation
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Domain Check Section */}
        <section id="domain-check" className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Domain Blacklist Check</h2>
          <div className="bg-black text-white rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Prüfungsumfang</h3>
                <ul className="space-y-4">
                  {[
                    'Domain-basierte Blacklists',
                    'SPF & DMARC Validierung',
                    'Domain Reputation',
                    'Mail Server Konfiguration',
                    'Content-basierte Spam-Filter'
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
                  {`GET /blacklist/domain?domain=example.com
X-API-Key: your-api-key

Prüft:
- Domain Blacklists
- Mail Server IPs
- DNS Konfiguration
- Reputation Score`}
                </pre>
                <Link
                  to="/blacklist?test=domain"
                  className="inline-flex items-center mt-4 text-sm font-medium text-white hover:underline"
                >
                  Domain jetzt prüfen
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
                <h3 className="text-xl font-semibold mb-4">Prävention</h3>
                <ul className="space-y-4">
                  {[
                    'Regelmäßige Blacklist-Überprüfungen durchführen',
                    'SPF, DKIM und DMARC implementieren',
                    'Bounce-Management einrichten',
                    'Sender Reputation überwachen'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <span className="text-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Monitoring</h3>
                <ul className="space-y-4">
                  {[
                    'Automatisierte Blacklist-Checks einrichten',
                    'Feedback-Loops bei ISPs registrieren',
                    'Abuse-Reports überwachen',
                    'Versandstatistiken analysieren'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Activity className="w-5 h-5 text-black mt-1 flex-shrink-0" />
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
              Integrieren Sie unsere Blacklist-Check-Capabilities in Ihre eigene Anwendung:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Verfügbare Endpoints</h3>
                <ul className="space-y-4">
                  {[
                    { path: '/blacklist/ip?ip=8.8.8.8', desc: 'IP Blacklist Check' },
                    { path: '/blacklist/domain?domain=example.com', desc: 'Domain Blacklist Check' }
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
  'https://api.webanalytics.com/blacklist/ip?ip=8.8.8.8', {
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
                to="/api#blacklist"
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

export default BlacklistWikiPage;
