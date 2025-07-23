const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller');
const userIconController = require('../controllers/userIcon.controller');
const userRecordController = require('../controllers/userRecord.controller');

// 프로필 관련
router.get('/', authenticateToken, userController.getProfile);
router.put('/icon', authenticateToken, userController.updateProfileIcon);
router.put('/character', authenticateToken, userController.updateProfileCharacter);
router.put('/level', authenticateToken, userController.updateProfileLevel);
router.put('/exp', authenticateToken, userController.updateProfileExp);
router.put('/gold', authenticateToken, userController.updateProfileGold);

// 아이콘 관련
router.get('/icons', authenticateToken, userIconController.getOwnedIcons);
router.post('/icons', authenticateToken, userIconController.purchaseIcon);

// 전적 관련
router.get('/record', authenticateToken, userRecordController.getRecord);
router.put('/record', authenticateToken, userRecordController.updateRecord);

module.exports = router;
