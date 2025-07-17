const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/auth');
const {
  UserProfile,
  UserRecord,
  MatchParticipant,
  UserProfileIcon,
  sequelize  
} = require('../../models');

// 내 전투 전적 (전투 기록)
router.get('/', authenticateToken, async (req, res) => {
  const record = await UserRecord.findOne({ where: { user_id: req.user.id } });
  res.json(record);
});

// 내 전적 수정 (매치 수, 승/패 수, 점수)
router.put('/', authenticateToken, async (req, res) => {
  const { rank_match_count, rank_wins, rank_losses, rank_point } = req.body;

  try {
    const user_id = req.user.id;

    // 1. 해당 유저의 기록을 먼저 수정
    const record = await UserRecord.findOne({ where: { user_id } });
    if (!record) return res.status(404).json({ success: false, message: 'User record not found' });

    record.rank_match_count = rank_match_count;
    record.rank_wins = rank_wins;
    record.rank_losses = rank_losses;
    record.rank_point = rank_point;
    record.tier = calculateTier(rank_point);

    await record.save();

    // 2. 전체 유저 정렬 후 글로벌 랭킹 업데이트
    const allRecords = await UserRecord.findAll({
      order: [['rank_point', 'DESC']]
    });

    for (let i = 0; i < allRecords.length; i++) {
      allRecords[i].global_rank = i + 1; // 1등부터 시작
      await allRecords[i].save(); // 순위 저장
    }

    // 3. 다시 조회해서 최신 정보 반환
    const updated = await UserRecord.findOne({ where: { user_id } });

    res.json({
      success: true,
      message: 'User record and global rank updated',
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

function calculateTier(rank_point) {
  if (rank_point >= 500) return 'Challenger';
  if (rank_point >= 400) return 'Master';
  if (rank_point >= 300) return 'Diamond';
  if (rank_point >= 200) return 'Gold';
  if (rank_point >= 100) return 'Silver';
  if (rank_point >= 10) return 'Bronze';
  return 'Iron';
}

module.exports = router;