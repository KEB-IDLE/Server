const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const { swaggerUi, swaggerSpec } = require('./config/swagger'); // swagger
const errorHandler = require('./middlewares/errorHandler'); // 에러 핸들러 추가

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Swagger 문서 경로 추가
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// **반드시 모든 라우터 뒤, 마지막 미들웨어로 등록**
app.use(errorHandler);

module.exports = app;
