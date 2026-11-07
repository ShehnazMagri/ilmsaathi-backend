import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IlmSaathi School ERP API',
      version: '1.0.0',
      description: 'Comprehensive REST API documentation for Student, Faculty, Employee, Attendance, Financials and Academic Management.'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server (Port 5000)'
      },
      {
        url: 'http://localhost:5001/api',
        description: 'Local Development Server (Port 5001)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    path.join(__dirname, '../routes/*.js')
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.use('/api-docs', (req, res) => res.redirect('/docs'));
  console.log('[Swagger Docs] API documentation active at /docs');
};
