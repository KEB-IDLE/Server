const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller');
const userIconController = require('../controllers/userIcon.controller');
const userRecordController = require('../controllers/userRecord.controller');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [User]
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
 * /user/icon:
 *   put:
 *     summary: 프로필 아이콘 변경
 *     tags: [User]
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

// 이하 동일한 패턴으로 다른 라우터에도 추가
/**
 * @swagger
 * /user/character:
 *   put:
 *     summary: 프로필 캐릭터 변경
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.put('/character', authenticateToken, userController.updateProfileCharacter);

/**
 * @swagger
 * /user/level:
 *   put:
 *     summary: 레벨 변경
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.put('/level', authenticateToken, userController.updateProfileLevel);

/**
 * @swagger
 * /user/exp:
 *   put:
 *     summary: 경험치 변경
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.put('/exp', authenticateToken, userController.updateProfileExp);

/**
 * @swagger
 * /user/gold:
 *   put:
 *     summary: 골드 변경
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.put('/gold', authenticateToken, userController.updateProfileGold);

/**
 * @swagger
 * /user/icons:
 *   get:
 *     summary: 보유 아이콘 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.get('/icons', authenticateToken, userIconController.getOwnedIcons);

/**
 * @swagger
 * /user/icons:
 *   post:
 *     summary: 아이콘 구매
 *     tags: [User]
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
 * /user/record:
 *   get:
 *     summary: 전적 조회
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.get('/record', authenticateToken, userRecordController.getRecord);

/**
 * @swagger
 * /user/record:
 *   put:
 *     summary: 전적 갱신
 *     tags: [User]
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
