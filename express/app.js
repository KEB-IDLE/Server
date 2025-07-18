const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('✅ .env.local 로딩됨');
} else {
  dotenv.config();
  console.log('✅ .env 로딩됨');
}

const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

sequelize.sync({ alter: true })
  .then(() => console.log('DB 연결 및 동기화 성공'))
  .catch(err => console.error('DB 연결 실패:', err));

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
