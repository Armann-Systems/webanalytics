import React from 'react';
import { Check, Infinity } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '0 €',
      description: 'Ideal für Entwickler und kleine Projekte',
      features: [
        '500 Anfragen pro Tag',
        'Alle API Endpunkte',
        'Standard Support',
        'Basis Rate Limiting'
      ],
      limit: '500 Anfragen/Tag',
      highlighted: false
    },
    {
      name: 'Pay-as-you-go',
      price: '0,005 €',
      description: 'Flexibel für wachsende Anforderungen',
      features: [
        'Pro Anfrage Abrechnung',
        'Alle API Endpunkte',
        'Priority Support',
        'Erhöhtes Rate Limiting'
      ],
      limit: 'Pro Anfrage',
      highlighted: true
    },
    {
      name: 'Business',
      price: '180 €',
      description: 'Optimal für mittlere Unternehmen',
      features: [
        '50.000 Anfragen/Monat',
        'Alle API Endpunkte',
        'Premium Support',
        'Angepasstes Rate Limiting'
      ],
      limit: '50.000 Anfragen/Monat',
      highlighted: false
    },
    {
      name: 'Enterprise',
      price: '1.000 €',
      description: 'Für große Unternehmen mit hohem Volumen',
      features: [
        'Unbegrenzte Anfragen',
        'Alle API Endpunkte',
        'Dedicated Support',
        'Individuelles Rate Limiting'
      ],
      limit: 'Unbegrenzt',
      highlighted: false
    }
  ];

  const volumeDiscounts = [
    {
      volume: '10.000',
      price: '50 €',
      pricePerRequest: '0,005 €'
    },
    {
      volume: '50.000',
      price: '180 €',
      pricePerRequest: '0,0036 €'
    },
    {
      volume: '200.000',
      price: '500 €',
      pricePerRequest: '0,0025 €'
    },
    {
      volume: 'Unbegrenzt',
      price: '1.000 €',
      pricePerRequest: '-'
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-4">Preise & Pakete</h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Wählen Sie den passenden Plan für Ihre Anforderungen. Alle Pläne beinhalten Zugriff auf sämtliche API-Endpunkte.
      </p>

      {/* Main pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 transition-all duration-300 ${
              plan.highlighted
                ? 'bg-black text-white transform hover:-translate-y-1'
                : 'bg-white hover:bg-black/5'
            }`}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.name !== 'Free' && plan.name !== 'Enterprise' && (
                  <span className="text-sm opacity-80">pro Anfrage</span>
                )}
              </div>
              <p className={`text-sm mt-2 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                {plan.description}
              </p>
            </div>

            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className={`w-5 h-5 ${plan.highlighted ? 'text-white' : 'text-black'}`} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className={`mt-6 pt-6 border-t ${
              plan.highlighted ? 'border-white/20' : 'border-gray-100'
            }`}>
              <div className="flex items-center justify-between text-sm">
                <span className={plan.highlighted ? 'text-white/80' : 'text-gray-600'}>
                  Limit
                </span>
                <span className="font-medium">{plan.limit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Volume discounts */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-6">Volumenbasierte Pakete</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {volumeDiscounts.map((tier) => (
            <div key={tier.volume} className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                {tier.volume === 'Unbegrenzt' ? (
                  <Infinity className="w-5 h-5 text-black" />
                ) : (
                  <span className="text-2xl font-bold">{tier.volume}</span>
                )}
                <span className="text-sm text-gray-600">Anfragen/Monat</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Preis/Monat</span>
                  <span className="font-medium">{tier.price} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pro Anfrage</span>
                  <span className="font-medium">{tier.pricePerRequest}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
