const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const {
  UserProfile,
  UserRecord,
  UserChampion,
  Champion,
  UserDeck,
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
  if (req.body.main_champion_id !== undefined) {
    fieldsToUpdate.main_champion_id = req.body.main_champion_id;
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
    await UserProfile.update(fieldsToUpdate, { where: { user_id: userId } });
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

// 내 보유 챔피언 목록
router.get('/champion', authenticateToken, async (req, res) => {
  const champions = await UserChampion.findAll({
    where: { user_id: req.user.id },
    include: [{ model: Champion }]
  });
  res.json(champions);
});

// 챔피언 해금
router.post('/champion/unlock', authenticateToken, async (req, res) => {
  const { champion_id } = req.body;
  await UserChampion.create({
    user_id: req.user.id,
    champion_id
  });
  res.json({ message: '챔피언 해금 완료' });
});

// 내 덱 목록 조회
router.get('/deck', authenticateToken, async (req, res) => {
  const decks = await UserDeck.findAll({ where: { user_id: req.user.id } });
  res.json(decks);
});

// 덱 저장 또는 수정
router.post('/deck', authenticateToken, async (req, res) => {
  const { deck_id, deck_name, champion_ids } = req.body;

  if (deck_id) {
    await UserDeck.update(
      { deck_name, champion_ids },
      { where: { id: deck_id, user_id: req.user.id } }
    );
    res.json({ message: '덱 수정 완료' });
  } else {
    await UserDeck.create({
      user_id: req.user.id,
      deck_name,
      champion_ids
    });
    res.status(201).json({ message: '덱 생성 완료' });
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
