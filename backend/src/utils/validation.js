const { validationResult } = require('express-validator');

// Domain validation helper function
function validateDomain(domain) {
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
}

// IP validation helper function
function validateIp(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
        return false;
    }

    if (ipv4Regex.test(ip)) {
        // Additional check for valid IPv4 octets
        const octets = ip.split('.');
        return octets.every(octet => {
            const num = parseInt(octet, 10);
            return num >= 0 && num <= 255;
        });
    }

    return true;
}

// Domain validator middleware
const domainValidator = (req, res, next) => {
    const domain = req.body.domain || req.query.domain;
    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
    }
    if (!validateDomain(domain)) {
        return res.status(400).json({ error: 'Invalid domain format' });
    }
    // Store the validated domain in request object
    req.validatedDomain = domain;
    next();
};

// IP validator middleware
const ipValidator = (req, res, next) => {
    const ip = req.body.ip || req.query.ip;
    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }
    if (!validateIp(ip)) {
        return res.status(400).json({ error: 'Invalid IP address format' });
    }
    // Store the validated IP in request object
    req.validatedIp = ip;
    next();
};

// Express-validator middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateDomain,
    validateIp,
    domainValidator,
    ipValidator,
    validateRequest
};
