const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definición de las opciones para Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Versión de OpenAPI
    info: {
      title: 'API de Agencia de Autos', // Título de la API
      version: '1.0.0', // Versión de la API
      description: 'Documentación de la API de la Agencia de Autos', // Descripción de la API
    },
    servers: [
      {
        url: 'http://localhost:3000', // URL del servidor (puede cambiar según tu configuración)
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos de rutas donde se encuentran las definiciones de los endpoints
};

// Genera la documentación Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Exporta la configuración para usarla en otros archivos
module.exports = { swaggerUi, swaggerDocs };
