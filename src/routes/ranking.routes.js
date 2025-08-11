const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const rankingController = require('../controllers/ranking.controller');

/**
 * @swagger
 * tags:
 *   name: Ranking
 *   description: 랭킹 관련 API
 */

/**
 * @swagger
 * /ranking:
 *   get:
 *     summary: 글로벌 랭킹 조회 (상위 10명)
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []  # JWT 인증 필요
 *     responses:
 *       200:
 *         description: 랭킹 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                         example: 1
 *                       nickname:
 *                         type: string
 *                         example: "player123"
 *                       profile_icon_id:
 *                         type: integer
 *                         example: 3
 *                       rank_point:
 *                         type: integer
 *                         example: 1580
 *       401:
 *         description: 인증 실패 (JWT 토큰 누락 또는 만료)
 *       500:
 *         description: 서버 에러
 */
router.get('/', authenticateToken, rankingController.getGlobalRanking);

module.exports = router;
