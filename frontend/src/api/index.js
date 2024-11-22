import axios from 'axios';
import DnsService from './services/DnsService';
import BlacklistService from './services/BlacklistService';
import SmtpService from './services/SmtpService';
import SslService from './services/SslService';
import { API_BASE_URL } from './config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle rate limit exceeded
      if (error.response.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const limitType = error.response.headers['x-ratelimit-type'];
        const message = error.response.data?.message || 
          `Rate limit exceeded ${limitType === 'rpm' ? 'per minute' : 'per day'}. Please try again later.`;
        throw new Error(message);
      }
      
      // Handle other errors
      throw new Error(error.response.data?.message || `HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
);

// Export both the axios instance as default and the services as named exports
export {
  DnsService,
  BlacklistService,
  SmtpService,
  SslService
};

export default api;
