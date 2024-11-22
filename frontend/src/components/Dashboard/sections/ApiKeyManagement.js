import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Plus, Trash2, Copy, AlertCircle } from 'lucide-react';
import ApiKeyService from '../../../api/services/ApiKeyService';
import AuthService from '../../../api/services/AuthService';

const ApiKeyManagement = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [showNewKey, setShowNewKey] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.initializeInterceptors(navigate);
        loadApiKeys();
    }, [navigate]);

    const loadApiKeys = async () => {
        try {
            const data = await ApiKeyService.getApiKeys();
            setApiKeys(data);
            setError('');
        } catch (err) {
            setError('Fehler beim Laden der API-Schlüssel');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        if (!newKeyName.trim()) {
            setError('Bitte geben Sie einen Namen für den API-Schlüssel ein');
            return;
        }

        try {
            setLoading(true);
            const newKey = await ApiKeyService.createApiKey(newKeyName);
            setShowNewKey(newKey);
            setApiKeys([...apiKeys, newKey]);
            setNewKeyName('');
            setShowCreateForm(false);
            setError('');
        } catch (err) {
            setError('Fehler beim Erstellen des API-Schlüssels');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteKey = async (keyId) => {
        if (!window.confirm('Sind Sie sicher, dass Sie diesen API-Schlüssel löschen möchten?')) {
            return;
        }

        try {
            setLoading(true);
            await ApiKeyService.deleteApiKey(keyId);
            setApiKeys(apiKeys.filter(key => key.id !== keyId));
            setError('');
        } catch (err) {
            setError('Fehler beim Löschen des API-Schlüssels');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">
                    <span className="block transform hover:translate-x-2 transition-transform duration-300">
                        API-Schlüssel
                    </span>
                </h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg font-medium 
                    transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Neuer API-Schlüssel
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Form */}
            {showCreateForm && (
                <div className="bg-black/[0.02] rounded-lg p-6 border border-black/5">
                    <h3 className="text-xl font-medium text-black mb-6">Neuen API-Schlüssel erstellen</h3>
                    <form onSubmit={handleCreateKey} className="space-y-4">
                        <div>
                            <label htmlFor="keyName" className="block text-sm font-medium text-black/60">
                                Name
                            </label>
                            <input
                                type="text"
                                id="keyName"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                text-black/80 transition-all duration-300
                                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                                placeholder="z.B. Entwicklung, Produktion, Test"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-6 py-3 border border-black/10 rounded-lg font-medium text-black/80
                                transition-all duration-300 hover:bg-black/5"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-black text-white rounded-lg font-medium 
                                transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10"
                            >
                                {loading ? 'Erstelle...' : 'Erstellen'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Newly Created Key */}
            {showNewKey && (
                <div className="rounded-lg bg-black/[0.02] p-6 border border-black/5">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Key className="h-6 w-6 text-black/40" />
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-black">
                                API-Schlüssel erfolgreich erstellt
                            </h3>
                            <div className="mt-2 text-black/60">
                                <p>Bitte speichern Sie diesen Schlüssel sicher - er wird nur einmal angezeigt:</p>
                                <div className="mt-2 flex items-center space-x-3">
                                    <code className="px-4 py-2 bg-black/[0.03] rounded-lg font-mono text-black/80">
                                        {showNewKey.api_key}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(showNewKey.api_key)}
                                        className="text-black/40 hover:text-black transition-colors duration-300"
                                    >
                                        <Copy className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowNewKey(null)}
                            className="text-black/40 hover:text-black transition-colors duration-300"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* API Keys List */}
            <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                <ul className="divide-y divide-black/5">
                    {apiKeys.map((key) => (
                        <li key={key.id} className="transition-all duration-300 hover:bg-black/[0.01]">
                            <div className="px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Key className="h-5 w-5 text-black/40 mr-3" />
                                        <p className="text-sm font-medium text-black">{key.name}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.03] text-black/60">
                                            Aktiv
                                        </span>
                                        <button
                                            onClick={() => handleDeleteKey(key.id)}
                                            className="text-black/40 hover:text-black transition-colors duration-300"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-col sm:flex-row sm:justify-between text-sm text-black/60">
                                    <p>
                                        Erstellt am: {new Date(key.created_at).toLocaleDateString('de-DE')}
                                    </p>
                                    <p>
                                        Letzte Nutzung: {key.last_used 
                                            ? new Date(key.last_used).toLocaleDateString('de-DE')
                                            : 'Noch nicht verwendet'}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                    {apiKeys.length === 0 && !loading && (
                        <li className="px-6 py-8 text-center text-black/60">
                            Keine API-Schlüssel vorhanden
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ApiKeyManagement;
