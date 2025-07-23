const redis = require('../utils/redisClient');
const { v4: uuidv4 } = require('uuid');

const QUEUE_KEY = 'match:queue';

async function joinQueue(userId) {
  const queue = await redis.lRange(QUEUE_KEY, 0, -1);
  if (queue.includes(String(userId))) {
    console.log(`유저 ${userId}가 이미 큐에 있음`);
    return;
  }

  await redis.rPush(QUEUE_KEY, String(userId));
  console.log(`유저 ${userId} 매칭 대기열에 추가됨`);
}

async function checkMatchStatus(userId) {
  const matchDataStr = await redis.get(`match:${userId}`);
  if (!matchDataStr) return null;

  try {
    return JSON.parse(matchDataStr);  // { opponent: 'userId', roomId: 'uuid' }
  } catch {
    return null;
  }
}

async function clearMatch(userId) {
  const matchDataStr = await redis.get(`match:${userId}`);
  if (matchDataStr) {
    const { opponent, roomId } = JSON.parse(matchDataStr);

    // 매칭 정보 삭제
    await redis.del(`match:${userId}`);
    if (opponent) await redis.del(`match:${opponent}`);

    // 게임룸 삭제
    if (roomId) {
      await redis.del(`gameRoom:${roomId}`);
      console.log(`게임룸 ${roomId} 삭제됨`);
    }

    console.log(`매칭 정보 제거됨: ${userId}, ${opponent}`);
  }
}

async function pairUsers() {
  const p1 = await redis.lPop(QUEUE_KEY);
  const p2 = await redis.lPop(QUEUE_KEY);

  console.log(`큐에서 꺼낸 유저들: ${p1}, ${p2}`);

  if (!p1 || !p2) {
    if (p1) await redis.lPush(QUEUE_KEY, p1);
    return;
  }

  if (p1 === p2) {
    console.warn(`동일 유저 매칭 시도 감지: ${p1}. 다시 큐에 넣음.`);
    await redis.lPush(QUEUE_KEY, p1);
    return;
  }

  const matched1 = await redis.get(`match:${p1}`);
  const matched2 = await redis.get(`match:${p2}`);
  if (matched1 || matched2) {
    console.warn(`이미 매칭 중인 유저 감지: ${p1}, ${p2}. 다시 큐에 넣음.`);
    await redis.lPush(QUEUE_KEY, p1);
    await redis.lPush(QUEUE_KEY, p2);
    return;
  }

  const roomId = uuidv4();

  const matchData1 = JSON.stringify({ opponent: p2, roomId });
  const matchData2 = JSON.stringify({ opponent: p1, roomId });

  // TTL 60초 설정 (게임 시작 후 별도 삭제 권장)
  await redis.set(`match:${p1}`, matchData1, { EX: 60 });
  await redis.set(`match:${p2}`, matchData2, { EX: 60 });

  // 게임룸에는 플레이어 정보만 저장
  await redis.set(`gameRoom:${roomId}`, JSON.stringify({ players: [p1, p2] }));

  console.log(`매칭 완료: ${p1} vs ${p2} (roomId: ${roomId})`);
}

function startMatchProcessor() {
  setInterval(pairUsers, 2000);
}

module.exports = {
  joinQueue,
  checkMatchStatus,
  clearMatch,
  startMatchProcessor,
};
