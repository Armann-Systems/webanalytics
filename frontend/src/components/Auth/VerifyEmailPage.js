import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import AuthService from '../../api/services/AuthService';

const VerifyEmailPage = () => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [error, setError] = useState('');
    const location = useLocation();

    // Get token from URL query parameters
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setError('Invalid verification link');
                return;
            }

            try {
                await AuthService.verifyEmail(token);
                setStatus('success');
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.error || 'Failed to verify email');
            }
        };

        verifyEmail();
    }, [token]);

    const handleResendVerification = async () => {
        try {
            const user = AuthService.getCurrentUser();
            if (user && user.email) {
                await AuthService.resendVerification(user.email);
                setError('A new verification email has been sent. Please check your inbox.');
            } else {
                setError('Please log in to resend verification email.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend verification email');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <div className="text-center">
                        <Loader className="h-12 w-12 text-black/40 mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold text-black mb-4">Email wird verifiziert</h2>
                        <p className="text-black/60">
                            Bitte warten Sie, während wir Ihre E-Mail-Adresse verifizieren...
                        </p>
                    </div>
                );
            case 'success':
                return (
                    <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-black/40 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-black mb-4">Email verifiziert!</h2>
                        <p className="text-black/60 mb-6">
                            Ihre E-Mail-Adresse wurde erfolgreich verifiziert.
                        </p>
                        <Link
                            to="/login"
                            className="group inline-flex items-center px-8 py-4 bg-black text-white rounded-lg font-medium 
                            transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10"
                        >
                            <span>Zum Login</span>
                            <ArrowRight className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center">
                        <XCircle className="h-12 w-12 text-black/40 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-black mb-4">Verifizierung fehlgeschlagen</h2>
                        <p className="text-black/60 mb-6">
                            {error || 'Der Verifizierungslink ist ungültig oder abgelaufen.'}
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={handleResendVerification}
                                className="w-full px-8 py-4 bg-black text-white rounded-lg font-medium 
                                transition-all duration-300 hover:bg-black/90 hover:shadow-xl hover:shadow-black/10"
                            >
                                Verifizierungs-Email erneut senden
                            </button>
                            <Link
                                to="/login"
                                className="block w-full px-8 py-4 border border-black/10 rounded-lg font-medium text-black/80
                                transition-all duration-300 hover:bg-black/5"
                            >
                                Zurück zum Login
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-black/5 rounded-full transform rotate-45"></div>
                <div className="absolute top-1/3 right-1/3 w-96 h-96 border border-black/5 rounded-full"></div>
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-black/[0.02] rounded-full blur-xl"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 transition-transform duration-300 hover:scale-[1.01]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
