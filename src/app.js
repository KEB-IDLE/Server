const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

const { swaggerUi, swaggerSpec } = require('./config/swagger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
