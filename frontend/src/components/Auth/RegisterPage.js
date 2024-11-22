import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        companyName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');
        setLoading(true);

        try {
            await AuthService.register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                companyName: formData.companyName
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-black/5 rounded-full transform rotate-45"></div>
                    <div className="absolute top-1/3 right-1/3 w-96 h-96 border border-black/5 rounded-full"></div>
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-black/[0.02] rounded-full blur-xl"></div>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
                    <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-black mb-4">Registration Successful!</h2>
                            <p className="text-black/60 mb-4">
                                Please check your email to verify your account.
                            </p>
                            <p className="text-black/40">
                                Redirecting to login page...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                        Create Account
                    </span>
                </h1>
                <p className="mt-2 text-center text-black/60">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-black hover:text-black/70 transition-colors duration-300">
                        Sign in
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-black/70">
                                    First Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                        placeholder="First name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-black/70">
                                    Last Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-black/70">
                                Company Name (Optional)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                    placeholder="Your company name"
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
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black/70">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-black/10 rounded-lg shadow-sm placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all duration-300 hover:border-black/30 sm:text-sm"
                                    placeholder="Confirm your password"
                                />
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
                                    {loading ? 'Creating account...' : 'Create account'}
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

export default RegisterPage;
