import React, { useState } from 'react';
import { Globe, Shield, Cpu, Key, ArrowRight, Check, Mail, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, features, isActive, onClick, toolLink, wikiLink }) => (
  <div 
    className={`group cursor-pointer transition-all duration-500 ${
      isActive 
        ? 'lg:col-span-2 bg-black text-white' 
        : 'bg-white hover:bg-black/5'
    }`}
    onClick={onClick}
  >
    <div className={`h-full rounded-2xl p-8 lg:p-10 relative overflow-hidden ${
      isActive ? 'lg:grid lg:grid-cols-2 lg:gap-8 items-center' : ''
    }`}>
      <div className={isActive ? 'relative' : ''}>
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-300 ${
          isActive 
            ? 'bg-white text-black' 
            : 'bg-black/5 text-black group-hover:bg-black/10'
        }`}>
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-black group-hover:text-black'
        }`}>
          {title}
        </h3>
        <p className={`text-lg leading-relaxed mb-6 transition-colors duration-300 ${
          isActive ? 'text-white/80' : 'text-black/60 group-hover:text-black/70'
        }`}>
          {description}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to={toolLink}
            className={`inline-flex items-center text-sm font-medium transition-colors duration-300 ${
              isActive ? 'text-white hover:text-white/90' : 'text-black/70 hover:text-black'
            }`}
          >
            Tool öffnen
            <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${
              isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
            }`} />
          </Link>
          <Link
            to={wikiLink}
            className={`inline-flex items-center text-sm font-medium transition-colors duration-300 ${
              isActive ? 'text-white hover:text-white/90' : 'text-black/70 hover:text-black'
            }`}
          >
            Mehr erfahren
            <ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${
              isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
            }`} />
          </Link>
        </div>
      </div>

      {/* Extended features list - only visible when active */}
      {isActive && features && (
        <div className="relative hidden lg:block">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Globe,
      title: 'DNS Prüfung',
      description: 'Umfassende DNS-Record Analyse für optimale Konfiguration.',
      toolLink: '/dns',
      wikiLink: '/wiki/dns',
      features: [
        'MX Record Validierung',
        'SPF & DMARC Überprüfung',
        'DNS Propagation Check',
        'Automatische Fehleranalyse',
        'Performance Optimierung'
      ]
    },
    {
      icon: Mail,
      title: 'SMTP Test',
      description: 'Detaillierte SMTP-Server Diagnose und Sicherheitsanalyse.',
      toolLink: '/smtp',
      wikiLink: '/wiki/smtp',
      features: [
        'Server Konfigurationstest',
        'TLS/SSL Überprüfung',
        'Authentifizierungstest',
        'Performance Analyse',
        'Sicherheitsvalidierung'
      ]
    },
    {
      icon: Shield,
      title: 'SSL Check',
      description: 'Umfassende SSL/TLS Zertifikatsanalyse und Sicherheitsprüfung.',
      toolLink: '/ssl',
      wikiLink: '/wiki/ssl',
      features: [
        'Zertifikatsvalidierung',
        'Ablaufüberwachung',
        'Cipher Suite Analyse',
        'HTTPS Konfiguration',
        'Security Best Practices'
      ]
    },
    {
      icon: Activity,
      title: 'Blacklist Check',
      description: 'Schützen Sie Ihre Online-Reputation durch proaktives Monitoring.',
      toolLink: '/blacklist',
      wikiLink: '/wiki/blacklist',
      features: [
        'Multi-RBL Überprüfung',
        'IP & Domain Scanning',
        'Echtzeit-Benachrichtigungen',
        'Detaillierte Reports',
        'Automatische Überwachung'
      ]
    }
  ];

  return (
    <section className="py-24 relative">
      {/* Background blur effect */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-black/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-black mb-6">
            Professionelle Tools
          </h2>
          <p className="text-xl text-black/60 leading-relaxed">
            Entdecken Sie unsere leistungsstarken Analyse-Tools für maximale Kontrolle über Ihre Online-Infrastruktur
          </p>
        </div>

        {/* Features grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              isActive={activeFeature === index}
              onClick={() => setActiveFeature(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Link
            to="/api"
            className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-black/90 hover:shadow-xl group"
          >
            API Dokumentation
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
