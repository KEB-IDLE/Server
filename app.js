require('dotenv').config();
const express = require('express');
const app = express();
const apiRoutes = require('./routes');
const { sequelize } = require('./models');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRoutes);
app.use(cors());

sequelize.sync({ alter: true })
  .then(() => console.log('DB 연결 및 동기화 성공'))
  .catch(err => console.error('DB 연결 실패:', err));


app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
