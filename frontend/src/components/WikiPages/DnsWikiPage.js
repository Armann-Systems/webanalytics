import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Globe, Check, ArrowRight, Shield, AlertTriangle, Terminal, Mail, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const DnsWikiPage = () => {
  return (
    <>
      <Helmet>
        <title>DNS Konfiguration & Best Practices | Umfassender DNS Guide</title>
        <meta name="description" content="Lernen Sie alles über DNS-Konfiguration, Best Practices und Fehlerbehebung. Mit praktischen Beispielen, Expertentipps und direktem Zugang zu professionellen DNS-Test-Tools." />
        <meta name="keywords" content="DNS Guide, DNS Best Practices, DNS Konfiguration, MX Records, SPF Records, DMARC, DNS Testing, DNS API" />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/wiki/dns" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-black/[0.02] to-black/[0.04] mb-6">
            <Globe className="w-10 h-10 text-black" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            DNS Guide & Best Practices
          </h1>
          <p className="text-xl text-black/60 max-w-3xl mx-auto">
            Umfassender Guide für DNS-Konfiguration, Testing und Optimierung. Mit praktischen Beispielen und direktem Zugang zu unseren Test-Tools.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/dns"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white hover:bg-black/90 transition-all duration-200"
            >
              <Terminal className="w-5 h-5 mr-2" />
              DNS Checker öffnen
            </Link>
            <Link
              to="/api#dns"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-black/10 hover:bg-black/5 transition-all duration-200"
            >
              <Code className="w-5 h-5 mr-2" />
              API Dokumentation
            </Link>
          </div>
        </div>

        {/* Quick Navigation */}
        <nav className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Schnellnavigation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'MX Records', href: '#mx-records', icon: Mail },
              { title: 'SPF Setup', href: '#spf-setup', icon: Shield },
              { title: 'DMARC Guide', href: '#dmarc-guide', icon: Shield },
              { title: 'DNS Testing', href: '#dns-testing', icon: Terminal },
              { title: 'Troubleshooting', href: '#troubleshooting', icon: AlertTriangle },
              { title: 'API Integration', href: '#api-integration', icon: Code }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group"
              >
                <div className="mr-3 p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] group-hover:from-black/[0.03] group-hover:to-black/[0.06] transition-all duration-200">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* MX Records Section */}
        <section id="mx-records" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">MX Records konfigurieren</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Best Practices</h3>
                <ul className="space-y-4">
                  {[
                    'Mindestens zwei MX-Server für Redundanz einrichten',
                    'Korrekte Prioritätswerte (niedrigere Zahlen = höhere Priorität)',
                    'Gültige Reverse-DNS-Einträge für alle Mail-Server',
                    'Regelmäßige Überprüfung der Mail-Server-Erreichbarkeit'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                      <span className="text-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    to="/dns?test=mx"
                    className="inline-flex items-center text-sm font-medium hover:underline"
                  >
                    MX Records jetzt testen
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">API Integration</h3>
                <p className="text-black/70 mb-4">
                  Automatisierte MX-Record Prüfungen über unsere API:
                </p>
                <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                  {`GET /dns/mx?domain=example.com
X-API-Key: your-api-key

Response:
{
  "records": [
    { "priority": 10, "exchange": "mx1.example.com" },
    { "priority": 20, "exchange": "mx2.example.com" }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* SPF Setup Section */}
        <section id="spf-setup" className="mb-16 scroll-mt-24">
          <div className="bg-black text-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">SPF Records einrichten</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Konfiguration</h3>
                <ul className="space-y-4">
                  {[
                    'Alle legitimen Mail-Server einbinden',
                    'Maximale DNS-Lookups beachten (max. 10)',
                    'Strikte Policy für nicht-autorisierte Server',
                    'Regelmäßige Validierung der Konfiguration'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Beispiel-Record</h3>
                <pre className="bg-white/10 text-white p-4 rounded-lg overflow-x-auto">
                  {`v=spf1 mx a:mail.example.com
      include:_spf.google.com
      ip4:192.168.1.1/24
      ~all`}
                </pre>
                <p className="mt-4 text-white/80">
                  Testen Sie Ihre SPF-Konfiguration mit unserem DNS-Checker:
                </p>
                <Link
                  to="/dns?test=spf"
                  className="inline-flex items-center mt-2 text-sm font-medium text-white hover:underline"
                >
                  SPF Record testen
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DMARC Guide Section */}
        <section id="dmarc-guide" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">DMARC Implementation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Schrittweise Einführung</h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="text-black/80">Monitoring-Phase (p=none)</li>
                  <li className="text-black/80">Quarantäne-Phase (p=quarantine)</li>
                  <li className="text-black/80">Strikte Policy (p=reject)</li>
                  <li className="text-black/80">Kontinuierliches Monitoring</li>
                </ol>
                <div className="mt-6">
                  <Link
                    to="/dns?test=dmarc"
                    className="inline-flex items-center text-sm font-medium hover:underline"
                  >
                    DMARC Record prüfen
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Beispiel-Record</h3>
                <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
                  {`v=DMARC1; p=reject;
pct=100; rua=mailto:dmarc@example.com;
ruf=mailto:forensik@example.com;
adkim=s; aspf=s;`}
                </pre>
                <p className="mt-4 text-black/70">
                  Validieren Sie Ihre DMARC-Konfiguration über unsere API:
                </p>
                <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto mt-2">
                  {`GET /dns/dmarc?domain=example.com
X-API-Key: your-api-key`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* DNS Testing Section */}
        <section id="dns-testing" className="mb-16 scroll-mt-24">
          <div className="bg-black text-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">DNS Testing & Monitoring</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Test-Szenarien</h3>
                <ul className="space-y-4">
                  {[
                    'Vollständige DNS-Record Validierung',
                    'Propagations-Überprüfung',
                    'Mail-Server Konfiguration',
                    'SPF & DMARC Compliance',
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
                <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
                <ul className="space-y-4">
                  {[
                    { path: '/dns/lookup', desc: 'DNS Lookup & Analyse' },
                    { path: '/dns/mx', desc: 'MX Record Check' },
                    { path: '/dns/spf', desc: 'SPF Validierung' },
                    { path: '/dns/dmarc', desc: 'DMARC Analyse' }
                  ].map((endpoint, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Terminal className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      <div>
                        <code className="font-mono text-sm bg-white/10 px-2 py-1 rounded">{endpoint.path}</code>
                        <p className="text-sm text-white/70 mt-1">{endpoint.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section id="troubleshooting" className="mb-16 scroll-mt-24">
          <div className="bg-gradient-to-b from-black/[0.02] to-black/[0.04] rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">Häufige Probleme & Lösungen</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  problem: 'DNS Propagation Verzögerung',
                  solution: 'TTL-Werte optimieren und DNS-Caches berücksichtigen. Nutzen Sie unseren Propagation Checker für Echtzeit-Updates.',
                  link: '/dns?test=propagation'
                },
                {
                  problem: 'SPF Record zu lang',
                  solution: 'Verwenden Sie include: Mechanismen und optimieren Sie die Anzahl der DNS-Lookups. Maximale Länge: 255 Zeichen.',
                  link: '/dns?test=spf'
                },
                {
                  problem: 'DMARC Reporting Fehler',
                  solution: 'Überprüfen Sie die Mailbox-Konfiguration für Aggregate Reports und stellen Sie sicher, dass die E-Mail-Adressen korrekt sind.',
                  link: '/dns?test=dmarc'
                },
                {
                  problem: 'MX Record Konflikte',
                  solution: 'Priorisieren Sie MX-Records korrekt und stellen Sie sicher, dass alle Mail-Server erreichbar sind.',
                  link: '/dns?test=mx'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">{item.problem}</h3>
                  <p className="text-black/70 mb-4">{item.solution}</p>
                  <Link
                    to={item.link}
                    className="inline-flex items-center text-sm font-medium hover:underline"
                  >
                    Problem analysieren
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Integration Section */}
        <section id="api-integration" className="mb-16 scroll-mt-24">
          <div className="bg-black text-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8">API Integration</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Automatisierung</h3>
                <p className="text-white/80 mb-6">
                  Integrieren Sie unsere DNS-Test-Capabilities in Ihre eigene Anwendung:
                </p>
                <ul className="space-y-4">
                  {[
                    'Automatisches DNS Monitoring',
                    'Batch-Processing für multiple Domains',
                    'Custom Reporting & Alerts',
                    'CI/CD Pipeline Integration'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Beispiel-Integration</h3>
                <pre className="bg-white/10 text-white p-4 rounded-lg overflow-x-auto">
                  {`const response = await fetch(
  'https://api.webanalytics.com/dns/lookup?domain=example.com', {
  headers: {
    'x-api-key': 'your-api-key'
  }
});

const data = await response.json();`}
                </pre>
                <Link
                  to="/api#dns"
                  className="inline-flex items-center mt-4 text-sm font-medium text-white hover:underline"
                >
                  Komplette API Dokumentation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DnsWikiPage;
