import { createApiRequest } from '../config';

class BlacklistService {
  async checkIP(ip) {
    return createApiRequest(`/blacklist/ip?ip=${encodeURIComponent(ip)}`);
  }

  async checkDomain(domain) {
    return createApiRequest(`/blacklist/domain?domain=${encodeURIComponent(domain)}`);
  }
}

export default new BlacklistService();
