const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const { swaggerUi, swaggerSpec } = require('./config/swagger'); // swagger

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Swagger 문서 경로 추가
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;