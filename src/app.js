const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const { swaggerUi, swaggerSpec } = require('./config/swagger'); // swagger

console.log('📄 Swagger Spec:', JSON.stringify(swaggerSpec, null, 2)); // 여기에 로그 추가!

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Swagger 문서 경로 추가
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
