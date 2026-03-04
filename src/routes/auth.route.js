const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/facebook', authController.facebookLogin);
router.post('/github', authController.githubLogin);

router.put('/update-interests', authMiddleware, authController.updateInterests);
router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;
