import { createApiRequest, API_BASE_URL, handleResponse } from '../config';

export class SmtpService {
  static async testSmtp(domain) {
    try {
      const response = await fetch(`${API_BASE_URL}/smtp/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain })
      }).then(handleResponse);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getSmtpDiagnostics(domain) {
    try {
      const response = await createApiRequest(`/smtp/diagnostics?domain=${encodeURIComponent(domain)}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data.message || 'Ein Fehler ist bei der SMTP-Überprüfung aufgetreten';
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('Server nicht erreichbar. Bitte überprüfen Sie Ihre Internetverbindung.');
    } else {
      // Error in request setup
      throw new Error('Fehler bei der Anfrage. Bitte versuchen Sie es später erneut.');
    }
  }
}

export default SmtpService;
