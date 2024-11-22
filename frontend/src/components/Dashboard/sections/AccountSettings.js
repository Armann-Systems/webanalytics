import React, { useState, useEffect } from 'react';
import { User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import AuthService from '../../../api/services/AuthService';

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        companyName: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setProfileData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                companyName: currentUser.companyName || ''
            });
        }
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await AuthService.updateProfile(profileData);
            setSuccess('Profil erfolgreich aktualisiert');
            
            const currentUser = AuthService.getCurrentUser();
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Aktualisieren des Profils');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Die neuen Passwörter stimmen nicht überein');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setError('Das neue Passwort muss mindestens 8 Zeichen lang sein');
            setLoading(false);
            return;
        }

        try {
            await AuthService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            setSuccess('Passwort erfolgreich geändert');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Fehler beim Ändern des Passworts');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">
                <span className="block transform hover:translate-x-2 transition-transform duration-300">
                    Kontoeinstellungen
                </span>
            </h2>

            {/* Success Message */}
            {success && (
                <div className="rounded-lg bg-black/[0.02] p-4 border border-black/5">
                    <div className="flex">
                        <CheckCircle className="h-5 w-5 text-black/60" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-black/80">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Settings */}
            <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-6">
                    <div className="flex items-center mb-6">
                        <User className="h-6 w-6 text-black/40 mr-3" />
                        <h3 className="text-xl font-medium text-black">Profil</h3>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-black/60">
                                    Vorname
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                    className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                    text-black/80 transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-black/60">
                                    Nachname
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                    className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                    text-black/80 transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-black/60">
                                Firma
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                value={profileData.companyName}
                                onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                text-black/80 transition-all duration-300
                                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-black text-white rounded-lg font-medium 
                                transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10"
                            >
                                {loading ? 'Speichere...' : 'Speichern'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Password Change */}
            <div className="bg-white shadow-2xl rounded-lg transition-all duration-300 hover:shadow-xl">
                <div className="px-6 py-6">
                    <div className="flex items-center mb-6">
                        <Lock className="h-6 w-6 text-black/40 mr-3" />
                        <h3 className="text-xl font-medium text-black">Passwort ändern</h3>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-black/60">
                                Aktuelles Passwort
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                text-black/80 transition-all duration-300
                                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-black/60">
                                Neues Passwort
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                text-black/80 transition-all duration-300
                                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black/60">
                                Neues Passwort bestätigen
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="mt-1 block w-full border border-black/10 rounded-lg shadow-sm py-2.5 px-4 
                                text-black/80 transition-all duration-300
                                focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-black text-white rounded-lg font-medium 
                                transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10"
                            >
                                {loading ? 'Ändere...' : 'Passwort ändern'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
