const app = require('./app');
const { sequelize } = require('./models');
const { startMatchProcessor } = require('./services/matchProcessor');

const PORT = process.env.PORT || 3000;

startMatchProcessor();

sequelize.sync({ alter: true })
  .then(() => console.log('DB 연결 및 동기화 성공'))
  .catch(err => console.error('DB 연결 실패:', err));

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
