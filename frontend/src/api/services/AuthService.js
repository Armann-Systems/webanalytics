import api from '../index';

class AuthService {
    static async register(data) {
        const response = await api.post('/auth/register', data);
        return response.data;
    }

    static async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    static async verifyEmail(token) {
        const response = await api.get(`/auth/verify-email/${token}`);
        return response.data;
    }

    static async resendVerification(email) {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    }

    static async forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    }

    static async resetPassword(token, newPassword) {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    }

    static async updateProfile(profileData) {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    }

    static async changePassword(currentPassword, newPassword) {
        const response = await api.put('/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    static getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    static isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static updateStoredUserData(userData) {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    }

    // Add authorization header to requests
    static setAuthHeader(config) {
        const token = this.getToken();
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        return config;
    }

    // Initialize axios interceptors
    static initializeInterceptors(navigate) {
        // Request interceptor
        api.interceptors.request.use(
            (config) => this.setAuthHeader(config),
            (error) => Promise.reject(error)
        );

        // Response interceptor
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
    }
}

export default AuthService;
