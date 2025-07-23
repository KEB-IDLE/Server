const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');

// 매칭 큐 참가
router.post('/join', matchController.joinQueue);

// 매칭 상태 조회
router.get('/status', matchController.checkMatchStatus);

// 게임 시작 알림
router.post('/start', matchController.startGame);

// 게임 종료 / 매칭 해제
router.post('/end', matchController.endGame);

module.exports = router;
