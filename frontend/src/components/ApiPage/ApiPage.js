import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Terminal, Lock, Zap, Shield, Globe, Mail, Key } from 'lucide-react';
import PricingSection from './sections/PricingSection';
import EndpointSection from './sections/EndpointSection';
import ApiExampleSection from './sections/ApiExampleSection';

const ApiPage = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('dns');

  const endpoints = {
    dns: {
      title: 'DNS API',
      icon: Globe,
      description: 'Comprehensive DNS record analysis and validation with detailed metrics.',
      routes: [
        { path: '/api/dns/lookup/:domain', method: 'GET', description: 'Complete DNS lookup with all record types and nameserver performance' },
        { path: '/api/dns/mx/:domain', method: 'GET', description: 'MX record analysis with server connectivity testing' },
        { path: '/api/dns/txt/:domain', method: 'GET', description: 'TXT record retrieval with type categorization' },
        { path: '/api/dns/spf/:domain', method: 'GET', description: 'SPF record parsing and policy analysis' },
        { path: '/api/dns/dmarc/:domain', method: 'GET', description: 'DMARC record validation and policy interpretation' }
      ]
    },
    smtp: {
      title: 'SMTP API',
      icon: Mail,
      description: 'Email server configuration analysis and comprehensive diagnostics.',
      routes: [
        { path: '/api/smtp/test/:domain', method: 'GET', description: 'Basic SMTP server testing with TLS and feature detection' },
        { path: '/api/smtp/diagnostics/:domain', method: 'GET', description: 'In-depth email configuration analysis and security assessment' }
      ]
    },
    ssl: {
      title: 'SSL API',
      icon: Lock,
      description: 'SSL/TLS certificate analysis and security assessment.',
      routes: [
        { path: '/api/ssl/check/:domain', method: 'GET', description: 'Comprehensive SSL certificate and configuration analysis' },
        { path: '/api/ssl/expiry/:domain', method: 'GET', description: 'Certificate expiration monitoring and validity assessment' }
      ]
    },
    blacklist: {
      title: 'Blacklist API',
      icon: Shield,
      description: 'IP and domain blacklist monitoring across multiple providers.',
      routes: [
        { path: '/api/blacklist/check/:ip', method: 'GET', description: 'IP address blacklist status across major providers' },
        { path: '/api/blacklist/status/:domain', method: 'GET', description: 'Domain and associated IPs blacklist analysis' }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>API Dokumentation | DNS, SSL & Email Server API</title>
        <meta name="description" content="REST API für DNS Analyse, SSL Zertifikat Check, SMTP Tests und Blacklist Monitoring. Einfache Integration mit detaillierter Dokumentation und Beispielcode." />
        <meta name="keywords" content="DNS API, SSL API, SMTP API, Blacklist API, Email Server API, REST API, API Integration, API Dokumentation, DNS Check API, SSL Check API" />
        <meta property="og:title" content="API Dokumentation | DNS, SSL & Email Server API" />
        <meta property="og:description" content="REST API für DNS Analyse, SSL Zertifikat Check, SMTP Tests und Blacklist Monitoring. Einfache Integration mit detaillierter Dokumentation." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="API Dokumentation | DNS, SSL & Email Server API" />
        <meta name="twitter:description" content="REST API für DNS Analyse, SSL Zertifikat Check, SMTP Tests und Blacklist Monitoring. Einfache Integration mit detaillierter Dokumentation." />
        <link rel="canonical" href="https://webanalytics.armann-systems.com/api" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 relative py-8">
        {/* Background pattern */}
        <div className="fixed inset-0 bg-grid-black opacity-[0.015] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black text-white mb-8">
              <Terminal className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integrate our powerful analysis tools directly into your application
            </p>
          </div>

          {/* Authentication Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
                  <Key className="w-6 h-6 text-black" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                <p className="text-gray-600 mb-6">
                  All API requests require an API key to be included in the request header.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm font-mono">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limits Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-black" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
                <p className="text-gray-600 mb-6">
                  The free plan is limited to 500 requests per day. Higher limits are available in premium plans.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm">
                    <div className="font-medium mb-2">Rate Limit Headers:</div>
                    <code className="font-mono">
                      X-RateLimit-Limit: 500<br />
                      X-RateLimit-Remaining: 486<br />
                      X-RateLimit-Reset: 1623456789
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Privacy Notice</h2>
                <p className="text-blue-800">
                  We only store the minimum necessary data for API operation:
                </p>
                <ul className="mt-4 space-y-2 text-blue-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    API keys for authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    IP addresses for rate limiting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    Temporary cache for performance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <PricingSection />

          {/* API Documentation */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(endpoints).map(([key, endpoint]) => {
                const Icon = endpoint.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedEndpoint(key)}
                    className={`p-6 rounded-xl transition-all duration-300 text-left ${
                      selectedEndpoint === key
                        ? 'bg-black text-white'
                        : 'bg-white hover:bg-black/5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                      selectedEndpoint === key
                        ? 'bg-white text-black'
                        : 'bg-black/5'
                    }`}>
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{endpoint.title}</h3>
                    <p className={`text-sm ${
                      selectedEndpoint === key
                        ? 'text-white/80'
                        : 'text-gray-600'
                    }`}>
                      {endpoint.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Endpoint Documentation */}
            <EndpointSection endpoint={endpoints[selectedEndpoint]} />

            {/* Interactive Example */}
            <ApiExampleSection endpoint={endpoints[selectedEndpoint]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiPage;
