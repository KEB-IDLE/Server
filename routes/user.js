const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const {
  UserProfile,
  UserRecord,
  MatchParticipant,
  UserProfileIcon,
  sequelize  
} = require('../models');

// 내 프로필 조회
router.get('/profile', authenticateToken, async (req, res) => {
  const profile = await UserProfile.findOne({ where: { user_id: req.user.id } });
  res.json(profile);
});

router.put('/profile/icon', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_icon_id } = req.body;
    await UserProfile.update({ profile_icon_id }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile icon updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update icon', error: err.message });
  }
});

router.put('/profile/character', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_char_id } = req.body;
    await UserProfile.update({ profile_char_id }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile character updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update character', error: err.message });
  }
});

router.put('/profile/level', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { level } = req.body;
    await UserProfile.update({ level }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile level updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update level', error: err.message });
  }
});

router.put('/profile/exp', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { exp } = req.body;
    await UserProfile.update({ exp }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile exp updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update exp', error: err.message });
  }
});

router.put('/profile/gold', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { gold } = req.body;
    await UserProfile.update({ gold }, { where: { user_id: userId } });
    const updated = await UserProfile.findOne({ where: { user_id: userId } });
    res.json({ success: true, message: 'Profile gold updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update gold', error: err.message });
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

router.get('/profile/icons', authenticateToken, async (req, res) => {
  try {
    const icons = await UserProfileIcon.findAll({
      where: { user_id: req.user.id },
      attributes: ['icon_id']
    });

    const iconIds = icons.map(i => i.icon_id);
    res.json(icons.map(i => i.icon_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch icons' });
  }
});

// 아이콘 구매 (골드 차감 + 아이콘 추가) - 트랜잭션 적용
router.post('/profile/icons', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { icon_id } = req.body;
  const iconPrice = 100; // 아이콘 가격 고정 (나중에 정책 변경 가능)

  if (typeof icon_id !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid icon_id' });
  }

  try {
    await sequelize.transaction(async (t) => {
      // 1. 유저 프로필 조회 (트랜잭션 포함)
      const user = await UserProfile.findOne({ where: { user_id: userId }, transaction: t, lock: t.LOCK.UPDATE });
      if (!user) throw new Error('User not found');

      // 2. 이미 소유 중인지 확인
      const owned = await UserProfileIcon.findOne({ where: { user_id: userId, icon_id }, transaction: t, lock: t.LOCK.UPDATE });
      if (owned) throw new Error('Already owned');

      // 3. 골드 충분한지 확인
      if (user.gold < iconPrice) throw new Error('Not enough gold');

      // 4. 골드 차감 및 저장
      user.gold -= iconPrice;
      await user.save({ transaction: t });

      // 5. 아이콘 추가
      await UserProfileIcon.create({ user_id: userId, icon_id }, { transaction: t });
    });

    // 트랜잭션 성공 시, 최신 골드 상태를 다시 조회해서 응답
    const updatedUser = await UserProfile.findOne({ where: { user_id: userId } });

    res.json({
      success: true,
      message: 'Icon purchased successfully',
      gold: updatedUser.gold // <-- data 대신 gold 직접 전달
    });
  } catch (err) {
    console.error(err);
    let status = 500;
    let message = 'Server error';

    if (err.message === 'Already owned' || err.message === 'Not enough gold' || err.message === 'User not found') {
      status = 400;
      message = err.message;
    }

    res.status(status).json({ success: false, message });
  }
});




// 내 매치 히스토리
router.get('/match/history', authenticateToken, async (req, res) => {
  const history = await MatchParticipant.findAll({
    where: { user_id: req.user.id }
  });
  res.json(history);
});

module.exports = router;