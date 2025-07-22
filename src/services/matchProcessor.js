const redis = require('../utils/redisClient');
const { v4: uuidv4 } = require('uuid');

const QUEUE_KEY = 'match:queue';

async function pairUsers() {
  const players = await redis.lRange(QUEUE_KEY, 0, 1);

  if (players.length < 2) return;

  const [p1, p2] = players;

  await redis.lPop(QUEUE_KEY);
  await redis.lPop(QUEUE_KEY);

  const matchId = uuidv4();

  await redis.set(`match:${p1}`, String(p2));
  await redis.set(`match:${p2}`, String(p1));

  console.log(`매칭 완료: ${p1} vs ${p2} (matchId: ${matchId})`);
}

function startMatchProcessor() {
  setInterval(pairUsers, 2000); // 2초마다 실행
}

module.exports = { startMatchProcessor };
