import React, { useState } from 'react';
import { Code, ChevronDown, ChevronRight } from 'lucide-react';
import CopyButton from '../../DnsPage/components/CopyButton';

const EndpointSection = ({ endpoint }) => {
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [activeTab, setActiveTab] = useState('request');

  if (!endpoint) return null;

  const getExampleResponse = (route) => {
    const examples = {
      '/api/dns/lookup/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 10166.5741,
            "timestamp": "2024-11-21T15:10:16.898Z",
            "nameserverPerformance": [
              {
                "nameserver": "ns2.google.com",
                "ip": "216.239.34.10",
                "responseTime": 51.4095,
                "status": "operational",
                "provider": "GOOGLE"
              }
            ]
          },
          "records": {
            "a": {
              "records": ["142.251.36.163"],
              "queryTimeMs": 13.8673,
              "ttl": null,
              "timestamp": "2024-11-21T15:10:16.821Z"
            },
            "aaaa": {
              "records": ["2a00:1450:4016:80b::2003"],
              "queryTimeMs": 19.0553,
              "ttl": null,
              "timestamp": "2024-11-21T15:10:16.827Z"
            }
          }
        }
      },
      '/api/dns/mx/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 5255.1685,
            "timestamp": "2024-11-21T15:10:42.491Z"
          },
          "mxRecords": [
            {
              "exchange": "smtp.google.com",
              "priority": 0,
              "addresses": [
                "108.177.96.26",
                "108.177.119.26"
              ],
              "connectionTest": {
                "connected": true,
                "responseTime": 21.2121
              },
              "reverseDns": "eh-in-f26.1e100.net"
            }
          ],
          "ttl": null
        }
      },
      '/api/dns/txt/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 5043.737,
            "timestamp": "2024-11-21T15:10:58.445Z"
          },
          "records": [
            {
              "record": "v=spf1 -all",
              "category": "EMAIL",
              "type": "SPF",
              "length": 11
            }
          ],
          "ttl": null
        }
      },
      '/api/dns/spf/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 5012.323,
            "timestamp": "2024-11-21T15:11:20.393Z"
          },
          "spfRecords": [
            {
              "raw": "v=spf1 -all",
              "mechanisms": [
                {
                  "qualifier": "-",
                  "type": "all",
                  "value": null
                }
              ],
              "policy": "-all"
            }
          ],
          "count": 1,
          "ttl": null,
          "valid": true
        }
      },
      '/api/dns/dmarc/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 5046.0478,
            "timestamp": "2024-11-21T15:11:32.862Z"
          },
          "dmarcRecords": [
            {
              "raw": "v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com",
              "version": "DMARC1",
              "policy": "reject",
              "reportingOptions": {
                "aggregateReports": "mailto:mailauth-reports@google.com"
              },
              "alignmentMode": {}
            }
          ],
          "count": 1,
          "ttl": null,
          "valid": true
        }
      },
      '/api/blacklist/check/:ip': {
        "success": true,
        "data": {
          "ip": "8.8.8.8",
          "queryMetrics": {
            "totalTimeMs": 220.1943,
            "averageResponseTimeMs": 136.98421666666667,
            "timestamp": "2024-11-21T15:11:43.624Z"
          },
          "summary": {
            "totalChecked": 6,
            "listedCount": 0,
            "reliabilityScore": 100,
            "riskLevel": {
              "level": "LOW",
              "score": 0
            }
          }
        }
      },
      '/api/blacklist/status/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 259.6566,
            "timestamp": "2024-11-21T15:11:58.672Z"
          },
          "summary": {
            "totalIpsChecked": 6,
            "totalBlacklistsChecked": 6,
            "anyListed": false,
            "overallRisk": {
              "score": 0,
              "level": "LOW"
            }
          }
        }
      },
      '/api/smtp/test/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 146.981,
            "mxLookupTimeMs": 0.8562,
            "timestamp": "2024-11-21T15:12:10.069Z"
          },
          "mxRecords": [
            {
              "host": "smtp.google.com",
              "priority": 0,
              "responseTimeMs": 142.8285,
              "ip": "108.177.96.27",
              "reverseDns": "eh-in-f27.1e100.net",
              "banner": "220 mx.google.com ESMTP a640c23a62f3a-aa4f42da1a4si100118066b.331 - gsmtp\r",
              "tlsSupported": true,
              "authMethods": []
            }
          ]
        }
      },
      '/api/smtp/diagnostics/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 47237.9622,
            "timestamp": "2024-11-21T15:13:08.382Z"
          },
          "emailConfiguration": {
            "mxRecords": [
              {
                "host": "smtp.google.com",
                "priority": 0
              }
            ],
            "txtRecords": [
              "v=spf1 -all"
            ]
          },
          "analysis": {
            "issues": [
              "TLS not properly configured on smtp.google.com"
            ],
            "recommendations": [
              "Configure TLS properly on smtp.google.com"
            ],
            "securityScore": 90
          }
        }
      },
      '/api/ssl/check/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 10520.904,
            "timestamp": "2024-11-21T15:13:30.843Z"
          },
          "certificates": [
            {
              "port": 443,
              "subject": {
                "CN": "*.google.de"
              },
              "issuer": {
                "C": "US",
                "O": "Google Trust Services",
                "CN": "WR2"
              }
            }
          ],
          "security": {
            "score": 95,
            "grade": "A+",
            "issues": [
              "Wildcard certificate in use"
            ]
          }
        }
      },
      '/api/ssl/expiry/:domain': {
        "success": true,
        "data": {
          "domain": "google.de",
          "queryMetrics": {
            "totalTimeMs": 35.5323,
            "timestamp": "2024-11-21T15:13:42.223Z"
          },
          "validity": {
            "notBefore": "Oct 21 08:39:29 2024 GMT",
            "notAfter": "Jan 13 08:39:28 2025 GMT",
            "daysRemaining": 53,
            "totalValidityDays": 84,
            "usedValidityDays": 32,
            "validityPercentageUsed": 38.095238095238095
          }
        }
      }
    };

    return examples[route.path] || {
      success: true,
      data: { message: "Example response" }
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Section Header */}
      <div className="flex items-start gap-6 mb-8 border-b border-gray-100 pb-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
            <Code className="w-6 h-6 text-black" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">{endpoint.title}</h2>
          <p className="text-gray-600">{endpoint.description}</p>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        {endpoint.routes.map((route, index) => (
          <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            {/* Endpoint Header */}
            <button
              onClick={() => setExpandedRoute(expandedRoute === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="px-3 py-1.5 bg-black text-white rounded-lg text-sm font-medium">
                  {route.method}
                </span>
                <code className="text-sm font-semibold">{route.path}</code>
                <span className="text-sm text-gray-600">{route.description}</span>
              </div>
              {expandedRoute === index ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Expanded Content */}
            {expandedRoute === index && (
              <div className="border-t border-gray-200 bg-white">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-4">
                  <button
                    onClick={() => setActiveTab('request')}
                    className={`px-6 py-3 text-sm font-medium relative ${
                      activeTab === 'request'
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Request
                    {activeTab === 'request' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('response')}
                    className={`px-6 py-3 text-sm font-medium relative ${
                      activeTab === 'response'
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Response
                    {activeTab === 'response' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'request' ? (
                    <div className="space-y-6">
                      {/* Parameters Section */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold mb-4">Parameters</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                            <div>
                              <code className="text-sm font-semibold">
                                {route.path.includes(':domain') ? 'domain' : 'ip'}
                              </code>
                              <p className="text-xs text-gray-600 mt-1">
                                {route.path.includes(':domain') 
                                  ? 'The domain name to analyze'
                                  : 'The IP address to check'}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                              Required
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Curl Example */}
                      <div>
                        <h3 className="text-sm font-semibold mb-4">Example Request</h3>
                        <div className="bg-gray-900 text-white rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <code className="text-sm font-mono">
                              curl -H "Authorization: Bearer api_key" \<br />
                              &nbsp;&nbsp;&nbsp;&nbsp;https://dns.armann-systems.com{route.path.replace(':domain', 'example.com').replace(':ip', '8.8.8.8')}
                            </code>
                            <CopyButton 
                              text={`curl -H "Authorization: Bearer api_key" https://dns.armann-systems.com${route.path.replace(':domain', 'example.com').replace(':ip', '8.8.8.8')}`}
                              light={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-semibold mb-4">Example Response</h3>
                      <div className="bg-gray-900 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <pre className="text-sm font-mono text-white overflow-x-auto">
                            {JSON.stringify(getExampleResponse(route), null, 2)}
                          </pre>
                          <CopyButton 
                            text={JSON.stringify(getExampleResponse(route), null, 2)}
                            light={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EndpointSection;
