const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../models'); // 트랜잭션을 위해 필요
const { User, UserProfile, UserRecord, UserChampion, UserDeck } = require('../models');

router.post('/register', async (req, res) => {
  const { email, password, nickname } = req.body;

  const t = await sequelize.transaction(); // 트랜잭션 시작
  try {
    // 이메일 중복 체크
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }

    // 닉네임 중복 체크
    const existingProfile = await UserProfile.findOne({ where: { nickname } });
    if (existingProfile) {
      return res.status(409).json({ success: false, message: 'Nickname already exists.' });
    }

    // 유저 생성
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword }, { transaction: t });

    const userId = user.id;

    // 유저 프로필 생성 (defaultValue 사용)
    await UserProfile.create({
      user_id: userId,
      nickname // 나머지는 defaultValue 적용됨
    }, { transaction: t });

    // 유저 전적 생성 (defaultValue 사용)
    await UserRecord.create({
      user_id: userId,
      last_login_at: new Date()
    }, { transaction: t });

    // 기본 해금 챔피언들 (예: 1, 2, 3)
    const defaultChampions = [1, 2, 3];
    const unlockData = defaultChampions.map(champion_id => ({
      user_id: userId,
      champion_id
      // is_unlocked은 defaultValue: true 자동 적용
    }));
    await UserChampion.bulkCreate(unlockData, { transaction: t });

    // 기본 덱 등록 (1번 슬롯, 챔피언 1, 2, 3 포함)
    await UserDeck.create({
      user_id: userId,
      slot_number: 1,
      champion_ids: defaultChampions
    }, { transaction: t });

    await t.commit(); // 트랜잭션 성공 시 커밋
    res.status(201).json({ success: true, message: 'Register Success', userId });
  } catch (err) {
    await t.rollback(); // 실패 시 롤백
    console.error('회원가입 실패:', err);
    res.status(500).json({ success: false, message: 'Register Failed', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.json({ token });
});

module.exports = router;
