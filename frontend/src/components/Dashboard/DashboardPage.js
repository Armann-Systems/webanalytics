import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ApiKeyManagement from './sections/ApiKeyManagement';
import AccountSettings from './sections/AccountSettings';
import UsageStatistics from './sections/UsageStatistics';
import { Key, User, BarChart } from 'lucide-react';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('api-keys');

    const tabs = [
        { id: 'api-keys', name: 'API-Schlüssel', icon: Key },
        { id: 'account', name: 'Konto', icon: User },
        { id: 'usage', name: 'Nutzungsstatistik', icon: BarChart }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'api-keys':
                return <ApiKeyManagement />;
            case 'account':
                return <AccountSettings />;
            case 'usage':
                return <UsageStatistics />;
            default:
                return <ApiKeyManagement />;
        }
    };

    return (
        <>
            <Helmet>
                <title>Dashboard | API-Schlüssel & Kontoeinstellungen</title>
                <meta name="description" content="Verwalten Sie Ihre API-Schlüssel und Kontoeinstellungen" />
            </Helmet>

            <div className="min-h-screen bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-[2.5rem] font-bold text-black">
                            <span className="block transform hover:translate-x-2 transition-transform duration-300">
                                Dashboard
                            </span>
                        </h1>
                        <p className="mt-2 text-xl text-black/60">
                            Verwalten Sie Ihre API-Schlüssel und Kontoeinstellungen
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-black/5">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                                            transition-all duration-300
                                            ${activeTab === tab.id
                                                ? 'border-black text-black'
                                                : 'border-transparent text-black/60 hover:text-black hover:border-black/5'
                                            }
                                        `}
                                    >
                                        <Icon
                                            className={`
                                                -ml-0.5 mr-2 h-5 w-5 transition-all duration-300
                                                ${activeTab === tab.id
                                                    ? 'text-black'
                                                    : 'text-black/40 group-hover:text-black/60'
                                                }
                                            `}
                                            aria-hidden="true"
                                        />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="mt-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
