import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, ArrowRight, Check } from 'lucide-react';

const ContactSection = () => {
  const [formState, setFormState] = useState({
    company: '',
    email: '',
    message: '',
    type: 'api' // or 'support'
  });

  const contactOptions = [
    {
      icon: Mail,
      label: 'E-Mail',
      value: 'info@armann-systems.com',
      link: 'mailto:info@armann-systems.com'
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: '+49 (0) 123 456 789',
      link: 'tel:+491234567890'
    },
    {
      icon: MessageSquare,
      label: 'Live Chat',
      value: 'Mo-Fr 9:00 - 17:00',
      link: '#chat'
    }
  ];

  const features = [
    'Flexible API Integration',
    'Technischer Support',
    'Service Level Agreement',
    'Custom Solutions',
    'Dokumentation',
    'Entwickler Support'
  ];

  return (
    <section className="relative py-24">
      {/* Background blur effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-black/5 rounded-full filter blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left Column - Main Content */}
          <div>
            <h2 className="text-4xl font-bold text-black mb-6">
              Bereit für den
              <br />
              <span className="relative">
                nächsten Schritt?
                <span className="absolute bottom-0 left-0 w-full h-1 bg-black/10"></span>
              </span>
            </h2>
            
            <p className="text-xl text-black/60 leading-relaxed mb-12">
              Kontaktieren Sie uns für eine professionelle API-Integration oder individuelle Lösungen für Ihr Unternehmen.
            </p>

            {/* Contact Options */}
            <div className="space-y-6 mb-12">
              {contactOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.link}
                  className="flex items-center group p-4 rounded-xl hover:bg-black/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mr-4 group-hover:bg-black/10 transition-all duration-300">
                    <option.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="text-sm text-black/60 mb-1">{option.label}</div>
                    <div className="font-medium text-black">{option.value}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-black/30 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:text-black" />
                </a>
              ))}
            </div>

            {/* Features List */}
            <div className="bg-black/5 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-black mb-6">
                Enterprise Features
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-black flex-shrink-0" />
                    <span className="text-black/70">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="relative">
            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-soft p-8 lg:p-10 relative">
              {/* Form Tabs */}
              <div className="flex space-x-4 mb-8">
                {['API Zugang', 'Support'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFormState({
                      ...formState,
                      type: tab.toLowerCase() === 'api zugang' ? 'api' : 'support'
                    })}
                    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                      formState.type === (tab.toLowerCase() === 'api zugang' ? 'api' : 'support')
                        ? 'bg-black text-white'
                        : 'text-black/60 hover:bg-black/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    Unternehmen
                  </label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-black/10 focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all duration-300"
                    placeholder="Ihr Unternehmen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-black/10 focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all duration-300"
                    placeholder="ihre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    Nachricht
                  </label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-black/10 focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all duration-300"
                    rows="4"
                    placeholder="Ihre Nachricht..."
                  ></textarea>
                </div>

                <button className="w-full bg-black text-white py-4 rounded-lg font-medium transition-all duration-300 hover:bg-black/90 hover:shadow-xl group">
                  <span className="flex items-center justify-center">
                    Absenden
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-24 text-center">
          <p className="text-black/60 mb-8">
            Noch Fragen? Schauen Sie sich unsere ausführliche Dokumentation an
          </p>
          <a 
            href="#docs" 
            className="inline-flex items-center text-black hover:text-black/70 font-medium transition-all duration-300"
          >
            Zur Dokumentation
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
