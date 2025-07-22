const express = require('express');
const router = express.Router();
const redis = require('../../utils/redisClient');

const QUEUE_KEY = 'match:queue';

router.post('/join', async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: 'userId 누락됨' });

  await redis.rPush(QUEUE_KEY, String(userId));
  console.log(`🔵 유저 ${userId} 매칭 대기열에 추가됨`);
  res.json({ matched: false });
});

router.get('/status', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId 누락됨' });

  const opponentId = await redis.get(`match:${userId}`);

  if (opponentId) {
    res.json({ matched: true, opponentId });
  } else {
    res.json({ matched: false });
  }
});

module.exports = router;
