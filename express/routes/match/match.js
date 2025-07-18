const express = require('express');
const router = express.Router();

const redisclient = require('../../utils/redisclient');

const MATCH_QUEUE_KEY = 'match_queue';

router.post('/join', async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'userId required' });

  // Redis에 문자열로 큐에 추가
  await redisclient.rPush(MATCH_QUEUE_KEY, String(userId));

  // 큐 상태 확인
  const queueLength = await redisclient.lLen(MATCH_QUEUE_KEY);

  if (queueLength >= 2) {
    const user1 = parseInt(await redisclient.lPop(MATCH_QUEUE_KEY));
    const user2 = parseInt(await redisclient.lPop(MATCH_QUEUE_KEY));

    // 여기서 매칭 성사 로직
    return res.status(200).json({
      matched: true,
      players: [user1, user2]
    });
  }

  return res.status(200).json({
    matched: false,
    message: '대기열에 추가됨'
  });
});

module.exports = router;
