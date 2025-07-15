const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const {
  UserProfile,
  UserRecord,
  MatchParticipant,
} = require('../models');

// 내 프로필 조회
router.get('/profile', authenticateToken, async (req, res) => {
  const profile = await UserProfile.findOne({ where: { user_id: req.user.id } });
  res.json(profile);
});

// 전체 또는 일부 프로필 수정
router.put('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const fieldsToUpdate = {};

  // 보낸 값만 업데이트
  if (req.body.profile_icon_id !== undefined) {
    fieldsToUpdate.profile_icon_id = req.body.profile_icon_id;
  }
  if (req.body.profile_char_id !== undefined) {
    fieldsToUpdate.profile_char_id = req.body.profile_champion_id;
  }
  if (req.body.nickname !== undefined) {
    fieldsToUpdate.nickname = req.body.nickname;
  }
  if (req.body.level !== undefined) {
    fieldsToUpdate.level = req.body.level;
  }
  if (req.body.exp !== undefined) {
    fieldsToUpdate.exp = req.body.exp;
  }
  if (req.body.gold !== undefined) {
    fieldsToUpdate.gold = req.body.gold;
  }

  try {
    await UserProfile.update(fieldsToUpdate, { where: { user_id: userId } });   // DB 저장
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Profile update failed', error: err.message });
  }
});


// 내 전투 전적 (전투 기록)
router.get('/record', authenticateToken, async (req, res) => {
  const record = await UserRecord.findOne({ where: { user_id: req.user.id } });
  res.json(record);
});

// 내 전적 수정 (매치 수, 승/패 수, 점수)
router.put('/record', authenticateToken, async (req, res) => {
  const { rank_match_count, rank_wins, rank_losses, rank_point } = req.body;

  try {
    const user_id = req.user.id;

    // 사용자 레코드 찾기
    const record = await UserRecord.findOne({ where: { user_id } });
    if (!record) return res.status(404).json({ message: 'User record not found' });

    // 필드 업데이트
    record.rank_match_count = rank_match_count;
    record.rank_wins = rank_wins;
    record.rank_losses = rank_losses;
    record.rank_point = rank_point;

    // 티어 계산 로직
    record.tier = calculateTier(rank_point);

    await record.save();    // DB 저장
    res.json({ message: 'User record updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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

// 내 매치 히스토리
router.get('/match/history', authenticateToken, async (req, res) => {
  const history = await MatchParticipant.findAll({
    where: { user_id: req.user.id }
  });
  res.json(history);
});

module.exports = router;