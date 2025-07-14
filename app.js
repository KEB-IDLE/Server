require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => console.log('DB 연결 및 동기화 성공'))
  .catch(err => console.error('DB 연결 실패:', err));

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
