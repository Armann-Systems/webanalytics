import React, { useState } from 'react';
import { Lock, Zap, Award, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';

const BenefitShowcase = ({ title, description, icon: Icon, features, isActive, onMouseEnter }) => (
  <div 
    className={`group transition-all duration-500 ${
      isActive ? 'lg:col-span-2' : ''
    }`}
    onMouseEnter={onMouseEnter}
  >
    <div className={`h-full p-8 lg:p-10 relative overflow-hidden rounded-2xl border border-black/5 transition-all duration-500 ${
      isActive ? 'bg-black text-white' : 'bg-white hover:bg-black/5'
    }`}>
      <div className={`relative ${isActive ? 'lg:grid lg:grid-cols-2 lg:gap-12 items-center' : ''}`}>
        <div>
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-500 ${
            isActive ? 'bg-white text-black' : 'bg-black/5 text-black'
          }`}>
            <Icon className="w-8 h-8" strokeWidth={1.5} />
          </div>

          {/* Content */}
          <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-500 ${
            isActive ? 'text-white' : 'text-black'
          }`}>
            {title}
          </h3>
          <p className={`text-lg leading-relaxed mb-6 transition-colors duration-500 ${
            isActive ? 'text-white/80' : 'text-black/60'
          }`}>
            {description}
          </p>

          <div className={`inline-flex items-center text-sm font-medium transition-all duration-300 ${
            isActive ? 'text-white' : 'text-black/70'
          }`}>
            Mehr erfahren
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform duration-300 ${
              isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
            }`} />
          </div>
        </div>

        {/* Extended features - only visible when active */}
        {isActive && (
          <div className="hidden lg:block relative">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const StatCounter = ({ value, label, duration = 2000 }) => {
  return (
    <div className="text-center group">
      <div className="text-4xl font-bold text-black mb-2 transition-transform duration-300 group-hover:scale-110">
        {value}
      </div>
      <div className="text-black/60">{label}</div>
    </div>
  );
};

const BenefitsSection = () => {
  const [activeBenefit, setActiveBenefit] = useState(0);

  const benefits = [
    {
      icon: Lock,
      title: 'Datenschutz First',
      description: 'Ihre Privatsphäre steht bei uns an erster Stelle. Keine Datenspeicherung, keine Kompromisse.',
      features: [
        'Keine Speicherung sensibler Daten',
        'DSGVO-konform',
        'Verschlüsselte Übertragung',
        'Anonyme Nutzung möglich',
        'Transparente Datenschutzrichtlinien'
      ]
    },
    {
      icon: Zap,
      title: 'Maximale Performance',
      description: 'Blitzschnelle Analyse und sofortige Ergebnisse für Ihre DNS & IP Tests.',
      features: [
        'Echtzeit-Analyse',
        'Parallele Verarbeitung',
        'Globales CDN',
        'Optimierte Algorithmen',
        'Minimale Latenzzeiten'
      ]
    },
    {
      icon: Award,
      title: 'Enterprise Ready',
      description: 'Professionelle Lösungen für Unternehmen jeder Größe.',
      features: [
        'SLA Garantien',
        '24/7 Support',
        'API Integration',
        'Custom Solutions',
        'Skalierbare Infrastruktur'
      ]
    }
  ];

  return (
    <section className="py-24 relative">
      {/* Background blur effect */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full filter blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-black mb-6">
            Warum Unsere Tools?
          </h2>
          <p className="text-xl text-black/60 leading-relaxed">
            Entdecken Sie die Vorteile unserer professionellen Analyse-Tools
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <BenefitShowcase
              key={index}
              {...benefit}
              isActive={activeBenefit === index}
              onMouseEnter={() => setActiveBenefit(index)}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-8 bg-white rounded-2xl shadow-soft">
          <StatCounter value="99.9%" label="Verfügbarkeit" />
          <StatCounter value="50+" label="Blacklists" />
          <StatCounter value="1M+" label="Analysen" />
          <StatCounter value="24/7" label="Support" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <button className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-black/90 hover:shadow-xl group">
            Jetzt kostenlos testen
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
