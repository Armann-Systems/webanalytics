const { AppError } = require('../../middleware/errorHandler');
const {
  getCertificateInfo,
  checkCTLogs,
  getExpiryStatus,
  generateExpiryRecommendations
} = require('./helpers');

async function checkExpiry(req, res, next) {
  try {
    const domain = req.validatedDomain;
    const startTime = process.hrtime();

    const certInfo = await getCertificateInfo(domain, 443);
    const now = new Date();
    const expiryDate = new Date(certInfo.validTo);
    const issueDate = new Date(certInfo.validFrom);
    
    // Calculate various time metrics
    const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    const totalValidityDays = Math.ceil((expiryDate - issueDate) / (1000 * 60 * 60 * 24));
    const usedValidityDays = Math.ceil((now - issueDate) / (1000 * 60 * 60 * 24));
    const validityPercentageUsed = (usedValidityDays / totalValidityDays) * 100;

    // Check CT logs
    const ctLogs = await checkCTLogs(certInfo.serialNumber);

    const [totalSeconds, totalNanoseconds] = process.hrtime(startTime);

    res.json({
      success: true,
      data: {
        domain,
        queryMetrics: {
          totalTimeMs: totalSeconds * 1000 + totalNanoseconds / 1000000,
          timestamp: new Date().toISOString()
        },
        validity: {
          notBefore: certInfo.validFrom,
          notAfter: certInfo.validTo,
          daysRemaining,
          totalValidityDays,
          usedValidityDays,
          validityPercentageUsed,
          status: getExpiryStatus(daysRemaining)
        },
        certificate: {
          serialNumber: certInfo.serialNumber,
          issuer: certInfo.issuer,
          subject: certInfo.subject,
          subjectAltNames: certInfo.subjectAltNames,
          keyUsage: certInfo.keyUsage,
          extendedKeyUsage: certInfo.extendedKeyUsage
        },
        transparency: ctLogs,
        recommendations: generateExpiryRecommendations(daysRemaining, validityPercentageUsed)
      }
    });
  } catch (error) {
    next(new AppError(error.statusCode || 500, error.message));
  }
}

module.exports = checkExpiry;
