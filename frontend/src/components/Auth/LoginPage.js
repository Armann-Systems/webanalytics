import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await AuthService.login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
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
                <h1 className="text-center">
                    <span className="block text-[2.5rem] font-bold text-black transform hover:translate-x-2 transition-transform duration-300">
                        Sign In
                    </span>
                </h1>
                <p className="mt-2 text-center text-black/60">
                    Or{' '}
                    <Link to="/register" className="font-medium text-black hover:text-black/70 transition-colors duration-300">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 transition-transform duration-300 hover:scale-[1.01]">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black/70">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-black/70">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-black/60 hover:text-black transition-colors duration-300">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group w-full flex justify-center px-8 py-4 border border-transparent rounded-lg font-medium transition-all duration-300 
                                    ${loading 
                                        ? 'bg-black/50 cursor-not-allowed' 
                                        : 'bg-black text-white hover:bg-black/90 hover:shadow-xl hover:shadow-black/10'
                                    }`}
                            >
                                <span className="flex items-center">
                                    {loading ? 'Signing in...' : 'Sign in'}
                                    {!loading && (
                                        <svg 
                                            className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
