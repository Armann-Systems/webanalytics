import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get token from URL query parameters
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid reset link');
        }
    }, [token]);

    const validatePassword = () => {
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter');
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setError('Password must contain at least one number');
            return false;
        }
        if (!/[!@#$%^&*]/.test(password)) {
            setError('Password must contain at least one special character');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setError('');
        setLoading(true);

        try {
            await AuthService.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
                            <p className="text-gray-600 mb-4">
                                The password reset link is invalid or has expired.
                            </p>
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                Request a new reset link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-green-600 mb-4">Password Reset Successful!</h2>
                            <p className="text-gray-600 mb-4">
                                Your password has been successfully reset.
                            </p>
                            <p className="text-gray-500">
                                Redirecting to login page...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>Password must:</p>
                            <ul className="list-disc list-inside">
                                <li>Be at least 8 characters long</li>
                                <li>Contain at least one uppercase letter</li>
                                <li>Contain at least one lowercase letter</li>
                                <li>Contain at least one number</li>
                                <li>Contain at least one special character (!@#$%^&*)</li>
                            </ul>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
