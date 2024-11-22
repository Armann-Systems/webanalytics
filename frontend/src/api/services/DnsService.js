import { createApiRequest } from '../config';

class DnsService {
  async lookup(domain) {
    return createApiRequest(`/dns/lookup?domain=${encodeURIComponent(domain)}`);
  }

  async getMXRecords(domain) {
    return createApiRequest(`/dns/mx?domain=${encodeURIComponent(domain)}`);
  }

  async getTXTRecords(domain) {
    return createApiRequest(`/dns/txt?domain=${encodeURIComponent(domain)}`);
  }

  async getSPFRecords(domain) {
    return createApiRequest(`/dns/spf?domain=${encodeURIComponent(domain)}`);
  }

  async getDMARCRecords(domain) {
    return createApiRequest(`/dns/dmarc?domain=${encodeURIComponent(domain)}`);
  }
}

export default new DnsService();
