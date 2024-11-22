import { createApiRequest } from '../config';

class SslService {
  async checkCertificate(domain) {
    return createApiRequest(`/ssl/check?domain=${encodeURIComponent(domain)}`);
  }

  async checkExpiry(domain) {
    return createApiRequest(`/ssl/expiry?domain=${encodeURIComponent(domain)}`);
  }
}

export default new SslService();
