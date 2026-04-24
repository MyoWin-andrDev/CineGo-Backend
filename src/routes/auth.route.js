const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);
router.post('/verify-email-otp', authController.verifyEmailOtp);
router.post('/resend-email-otp', authController.resendEmailOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/resend-reset-otp', authController.resendResetOtp);
router.post('/verify-reset-otp', authController.verifyResetOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/facebook', authController.facebookLogin);
router.post('/github', authController.githubLogin);

router.put('/update-interests', authMiddleware, authController.updateInterests);
router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;
