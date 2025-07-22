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

router.get('/', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, async (req, res) => {
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

module.exports = router;