require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateApiKey, trackApiUsage, cacheResponse } = require('./middleware/apiAuth');
const db = require('./db');
const apiKeyCache = require('./services/apiKeyCache');
const setupSwagger = require('./config/swagger');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(express.json());
app.use(cors());
app.use(compression());

// Configure helmet with exceptions for Swagger UI
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Add a test route to verify Express is working
app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Initialize API
async function initializeAPI() {
    try {
        console.log('Testing database connection...');
        // Test database connection
        const dbConnected = await db.testConnection();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        console.log('Database connection successful');

        console.log('Loading API keys into cache...');
        // Load API keys into cache
        await apiKeyCache.loadAllKeys();
        console.log('API key cache initialized');

        // Initialize Swagger documentation first, before any routes
        console.log('Setting up Swagger documentation...');
        const swaggerInstance = setupSwagger(app);

        // Wait for Swagger to finish initializing
        await new Promise((resolve, reject) => {
            let resolved = false;
            swaggerInstance.on('finish', () => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            });
            swaggerInstance.on('error', (err) => {
                if (!resolved) {
                    resolved = true;
                    reject(err);
                }
            });
            // Add a timeout just in case
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, 5000);
        });
        
        console.log('Swagger initialization complete');

        // Mount API routes
        console.log('Mounting API routes...');
        
        // Mount all routes under /api
        app.use('/api', (req, res, next) => {
            // Skip authentication for OPTIONS requests and Swagger docs
            if (req.method === 'OPTIONS' || req.url.startsWith('/api-docs')) {
                return next();
            }
            
            // Apply authentication middleware chain
            authenticateApiKey(req, res, (err) => {
                if (err) return next(err);
                trackApiUsage(req, res, (err) => {
                    if (err) return next(err);
                    cacheResponse(req, res, next);
                });
            });
        }, routes);

        // Add catch-all route for debugging
        app.use('*', (req, res) => {
            console.log('404 - Route not found:', req.originalUrl);
            res.status(404).json({
                error: 'Route not found',
                path: req.originalUrl,
                availableEndpoints: [
                    '/api-docs',
                    '/api/dns/*',
                    '/api/smtp/*',
                    '/api/ssl/*',
                    '/api/blacklist/*',
                    '/test'
                ]
            });
        });

        // Error handling must be last
        app.use(errorHandler);

        // Start server
        app.listen(PORT, () => {
            console.log(`\nServer running on port ${PORT}`);
            console.log('Environment:', process.env.NODE_ENV || 'development');
            console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
            console.log(`Test endpoint available at http://localhost:${PORT}/test`);
        });

    } catch (error) {
        console.error('Failed to initialize API:', error);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Initialize the API
initializeAPI().catch(error => {
    console.error('API initialization failed:', error);
    process.exit(1);
});
