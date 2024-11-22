import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import DnsPage from './components/DnsPage/DnsPage';
import BlacklistPage from './components/BlacklistPage/BlacklistPage';
import SmtpPage from './components/SmtpPage/SmtpPage';
import SslPage from './components/SslPage/SslPage';
import ApiPage from './components/ApiPage/ApiPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';
import VerifyEmailPage from './components/Auth/VerifyEmailPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import DnsWikiPage from './components/WikiPages/DnsWikiPage';
import SslWikiPage from './components/WikiPages/SslWikiPage';
import SmtpWikiPage from './components/WikiPages/SmtpWikiPage';
import BlacklistWikiPage from './components/WikiPages/BlacklistWikiPage';
import ScrollToTop from './components/ScrollToTop';
import AuthService from './api/services/AuthService';
import './App.css';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
    if (!AuthService.isLoggedIn()) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize auth interceptors
        AuthService.initializeInterceptors(navigate);
    }, [navigate]);

    return (
        <HelmetProvider>
            <div className="flex flex-col min-h-screen">
                <ScrollToTop />
                <Header />
                <main className="flex-grow bg-gray-50">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dns" element={<DnsPage />} />
                        <Route path="/blacklist" element={<BlacklistPage />} />
                        <Route path="/smtp" element={<SmtpPage />} />
                        <Route path="/ssl" element={<SslPage />} />
                        <Route path="/api" element={<ApiPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />

                        {/* Wiki routes */}
                        <Route path="/wiki/dns" element={<DnsWikiPage />} />
                        <Route path="/wiki/ssl" element={<SslWikiPage />} />
                        <Route path="/wiki/smtp" element={<SmtpWikiPage />} />
                        <Route path="/wiki/blacklist" element={<BlacklistWikiPage />} />

                        {/* Protected routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </HelmetProvider>
    );
}

export default App;
