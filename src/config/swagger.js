const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '프로젝트 API 명세서',
      version: 'v1.0.0',
      description: '[Auto Battle Tactics] 게임 프로젝트의 API 문서입니다.',
    },
    servers: [
      {
        url: 'https://jamsik.p-e.kr',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [__dirname + '/../routes/*.js']
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
