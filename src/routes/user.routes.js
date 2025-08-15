const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const userIconController = require('../controllers/userIcon.controller');
const userRecordController = require('../controllers/userRecord.controller');

/**
 * @swagger
 * tags:
 *   name: 사용자
 *   description: 프로필, 아이콘, 전적 등 사용자 관련 API
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 반환 성공
 *       401:
 *         description: 인증 실패
 */
router.get('/', authenticateToken, userController.getProfile);

/**
 * @swagger
 * /api/user/icon:
 *   put:
 *     summary: 프로필 아이콘 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_icon_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 아이콘 변경 성공
 *       401:
 *         description: 인증 실패
 */
router.put('/icon', authenticateToken, userController.updateProfileIcon);

/**
 * @swagger
 * /api/user/character:
 *   put:
 *     summary: 프로필 캐릭터 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 */
router.put('/character', authenticateToken, userController.updateProfileCharacter);

/**
 * @swagger
 * /api/user/level:
 *   put:
 *     summary: 레벨 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 */
router.put('/level', authenticateToken, userController.updateProfileLevel);

/**
 * @swagger
 * /api/user/exp:
 *   put:
 *     summary: 경험치 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 */
router.put('/exp', authenticateToken, userController.updateProfileExp);

/**
 * @swagger
 * /api/user/gold:
 *   put:
 *     summary: 골드 변경
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 */
router.put('/gold', authenticateToken, userController.updateProfileGold);

/**
 * @swagger
 * /api/user/icons:
 *   get:
 *     summary: 보유 아이콘 조회
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 */
router.get('/icons', authenticateToken, userIconController.getOwnedIcons);

/**
 * @swagger
 * /api/user/icons:
 *   post:
 *     summary: 아이콘 구매
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icon_id:
 *                 type: integer
 */
router.post('/icons', authenticateToken, userIconController.purchaseIcon);

/**
 * @swagger
 * /api/user/record:
 *   get:
 *     summary: 전적 조회
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 */
router.get('/record', authenticateToken, userRecordController.getRecord);

/**
 * @swagger
 * /api/user/record:
 *   put:
 *     summary: 전적 갱신
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rank_match_count:
 *                 type: integer
 *               rank_wins:
 *                 type: integer
 *               rank_losses:
 *                 type: integer
 *               rank_point:
 *                 type: integer
 */
router.put('/record', authenticateToken, userRecordController.updateRecord);

module.exports = router;
