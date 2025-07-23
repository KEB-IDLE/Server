const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const rankingController = require('../controllers/ranking.controller');

router.get('/', authenticateToken, rankingController.getGlobalRanking);

module.exports = router;
