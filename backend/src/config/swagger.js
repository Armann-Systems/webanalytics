const expressJSDocSwagger = require('express-jsdoc-swagger');
const path = require('path');
const fs = require('fs');

// Debug function to check if files exist and are readable
function validateFiles(baseDir, patterns) {
    console.log('\nSwagger Debug Info:');
    console.log('Base Directory:', baseDir);
    console.log('File Patterns:', patterns);

    patterns.forEach(pattern => {
        const fullPath = path.join(baseDir, pattern);
        console.log(`\nChecking pattern: ${pattern}`);
        
        try {
            // Extract directory path from pattern
            const dirPath = path.join(baseDir, pattern.split('*')[0]);
            if (fs.existsSync(dirPath)) {
                console.log(`Directory exists: ${dirPath}`);
                // Recursively list all JS files
                function listJsFiles(dir) {
                    const files = fs.readdirSync(dir);
                    files.forEach(file => {
                        const filePath = path.join(dir, file);
                        const stat = fs.statSync(filePath);
                        if (stat.isDirectory()) {
                            listJsFiles(filePath);
                        } else if (file.endsWith('.js')) {
                            console.log(`Found JS file: ${filePath}`);
                            try {
                                const content = fs.readFileSync(filePath, 'utf8');
                                const hasJSDoc = content.includes('@openapi');
                                console.log(`  - ${file}: ${hasJSDoc ? 'Has @openapi tags' : 'No @openapi tags found'}`);
                            } catch (err) {
                                console.log(`  - Error reading ${file}: ${err.message}`);
                            }
                        }
                    });
                }
                listJsFiles(dirPath);
            } else {
                console.log(`Directory does not exist: ${dirPath}`);
            }
        } catch (err) {
            console.log(`Error checking pattern ${pattern}: ${err.message}`);
        }
    });
}

const options = {
    info: {
        version: '1.0.0',
        title: 'Web Analytics API',
        description: 'API documentation for Web Analytics services',
        termsOfService: '',
    },
    security: {
        ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
        },
        BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Development server'
        }
    ],
    // Set baseDir to the backend root
    baseDir: path.join(__dirname, '../..'),
    // Include all relevant files
    filesPattern: [
        'src/controllers/**/*.js',
        'src/routes/**/*.js',
        'src/middleware/**/*.js'
    ],
    swaggerUIPath: '/api/api-docs',
    exposeSwaggerUI: true,
    exposeApiDocs: true,
    apiDocsPath: '/api/api-docs.json',
    notRequiredAsNullable: false,
    swaggerUiOptions: {
        swaggerOptions: {
            persistAuthorization: true,
            displayOperationId: false,
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            defaultModelsExpandDepth: 1,
            defaultModelExpandDepth: 1,
            tryItOutEnabled: true
        }
    },
    // Enable multiple OpenAPI specs
    multiple: false
};

module.exports = (app) => {
    // Run validation before setting up swagger
    validateFiles(options.baseDir, options.filesPattern);
    
    // Initialize swagger
    const swagger = expressJSDocSwagger(app)(options);
    
    // Add error handling
    swagger.on('error', (err) => {
        console.error('Swagger initialization error:', err);
    });
    
    swagger.on('finish', () => {
        console.log('Swagger initialization complete');
    });
    
    return swagger;
};
