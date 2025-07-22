const dotenv = require('dotenv');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');

// env 설정
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('env.local 로딩됨');
} else {
  dotenv.config();
  console.log('.env 로딩됨');
}

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

module.exports = app;
