import React, { useState } from 'react';
import InfoTooltip from '../../DnsPage/components/InfoTooltip';
import CopyButton from '../../DnsPage/components/CopyButton';

const SecurityAnalysis = ({ analysis, emailConfiguration }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const sections = [
    {
      id: 'spf',
      title: 'SPF Konfiguration',
      tooltip: {
        title: 'Sender Policy Framework',
        content: (
          <div className="space-y-2">
            <p>SPF definiert autorisierte Mail-Server:</p>
            <ul className="list-disc list-inside">
              <li>Verhindert E-Mail-Spoofing</li>
              <li>Reduziert Spam</li>
              <li>Verbessert Zustellbarkeit</li>
            </ul>
          </div>
        )
      }
    },
    {
      id: 'dmarc',
      title: 'DMARC Policy',
      tooltip: {
        title: 'Domain-based Message Authentication',
        content: (
          <div className="space-y-2">
            <p>DMARC definiert den Umgang mit fehlgeschlagener Authentifizierung:</p>
            <ul className="list-disc list-inside">
              <li>Basiert auf SPF und DKIM</li>
              <li>Ermöglicht Reporting</li>
              <li>Schützt Domain-Reputation</li>
            </ul>
          </div>
        )
      }
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Security Score */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Sicherheitsanalyse</h2>
          <InfoTooltip 
            title="E-Mail Sicherheit"
            content={
              <div className="space-y-2">
                <p>Bewertung der E-Mail-Sicherheit basierend auf:</p>
                <ul className="list-disc list-inside">
                  <li>SPF Konfiguration</li>
                  <li>DMARC Policy</li>
                  <li>TLS Verschlüsselung</li>
                  <li>Server-Konfiguration</li>
                </ul>
              </div>
            }
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Sicherheitsbewertung</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.securityScore)}`}>
              {analysis.securityScore}/100
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getScoreColor(analysis.securityScore)}`}
              style={{ width: `${analysis.securityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-gray-50 rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{section.title}</h3>
                  <InfoTooltip 
                    title={section.tooltip.title}
                    content={section.tooltip.content}
                  />
                  {section.id === 'spf' ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${emailConfiguration.spf ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {emailConfiguration.spf ? 'Konfiguriert' : 'Nicht Konfiguriert'}
                    </span>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${emailConfiguration.dmarc ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {emailConfiguration.dmarc ? 'Konfiguriert' : 'Nicht Konfiguriert'}
                    </span>
                  )}
                </div>
                <button
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label={expandedSection === section.id ? 'Einklappen' : 'Ausklappen'}
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {expandedSection === section.id && (
              <div className="border-t border-gray-200 p-4">
                {section.id === 'spf' ? (
                  emailConfiguration.spf ? (
                    <div className="space-y-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">SPF Record</span>
                          <CopyButton text={emailConfiguration.spf.record} />
                        </div>
                        <code className="text-sm break-all">{emailConfiguration.spf.record}</code>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {emailConfiguration.spf.mechanisms.map((mech, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                            <span className="font-medium">{mech.mechanism}</span>
                            {mech.value && (
                              <span className="ml-2 text-gray-600">{mech.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600">Kein SPF Record gefunden</div>
                  )
                ) : (
                  emailConfiguration.dmarc ? (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">DMARC Record</span>
                        <CopyButton text={emailConfiguration.dmarc} />
                      </div>
                      <code className="text-sm break-all">{emailConfiguration.dmarc}</code>
                    </div>
                  ) : (
                    <div className="text-red-600">Kein DMARC Record gefunden</div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">Identifizierte Probleme</h3>
            <InfoTooltip
              title="Sicherheitsprobleme"
              content="Gefundene Konfigurationsprobleme und Sicherheitslücken, die behoben werden sollten"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            {analysis.issues.length > 0 ? (
              <ul className="space-y-2">
                {analysis.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    </span>
                    <span className="text-red-600">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-green-600">Keine Probleme gefunden</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">Empfehlungen</h3>
            <InfoTooltip
              title="Sicherheitsempfehlungen"
              content="Konkrete Vorschläge zur Verbesserung der E-Mail-Sicherheit und -Konfiguration"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            {analysis.recommendations.length > 0 ? (
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </span>
                    <span className="text-blue-600">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-green-600">Keine Empfehlungen notwendig</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalysis;
