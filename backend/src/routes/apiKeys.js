const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get all API keys for the authenticated user
router.get('/', apiKeyController.getApiKeys);

// Create a new API key
router.post('/', apiKeyController.createApiKey);

// Delete an API key
router.delete('/:id', apiKeyController.deleteApiKey);

// Get usage statistics for an API key
router.get('/:id/usage', apiKeyController.getApiKeyUsage);

module.exports = router;
