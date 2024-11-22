import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import CopyButton from '../../DnsPage/components/CopyButton';

const ApiExampleSection = ({ endpoint }) => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async (route) => {
    if (!domain) {
      setError('Bitte geben Sie eine Domain ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000${route.path.replace(':domain', domain)}`,
        {
          headers: {
            'Authorization': 'Bearer demo_key'
          }
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  if (!endpoint) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold mb-6">Live API Tester</h2>
      <p className="text-gray-600 mb-8">
        Testen Sie die API-Endpunkte direkt mit einer Demo-API-Key. 
        Beachten Sie, dass die Anzahl der Test-Anfragen begrenzt ist.
      </p>

      {/* Input Form */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Domain eingeben (z.B. example.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black/20 focus:border-black transition-colors"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 mt-2">
            {error}
          </div>
        )}
      </div>

      {/* Endpoint Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {endpoint.routes.map((route, index) => (
          <button
            key={index}
            onClick={() => handleTest(route)}
            disabled={loading}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-black/20 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </div>
              <div className="text-left">
                <div className="font-medium">{route.description}</div>
                <div className="text-sm text-gray-600">{route.method} {route.path}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Results */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Ergebnis</h3>
            <CopyButton text={JSON.stringify(result, null, 2)} />
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="font-mono text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Demo Key Notice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm">i</span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Demo API Key</h4>
            <p className="text-sm text-blue-800">
              Diese Demo verwendet einen eingeschränkten API-Schlüssel. Für produktive Nutzung registrieren Sie sich bitte für einen vollständigen API-Schlüssel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiExampleSection;
