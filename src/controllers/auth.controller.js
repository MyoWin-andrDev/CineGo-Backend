const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const { sendOtpEmail, sendPasswordResetEmail } = require('../services/email.service');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const OTP_TTL_MINUTES = 5;
const OTP_TTL_MS = OTP_TTL_MINUTES * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_RESEND_COUNT = 5;

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const generateOtp = () => {
    return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
};

const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

const getRetryAfterSec = (lastSentAt) => {
    if (!lastSentAt) {
        return 0;
    }

    const elapsed = Date.now() - new Date(lastSentAt).getTime();
    const remaining = OTP_RESEND_COOLDOWN_MS - elapsed;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

const getPublicUser = (user) => {
    const payload = user.toObject ? user.toObject() : user;
    delete payload.password;
    delete payload.emailOtpHash;
    delete payload.emailOtpExpiresAt;
    delete payload.emailOtpAttempts;
    delete payload.emailOtpLastSentAt;
    delete payload.emailOtpResendCount;
    delete payload.resetOtpHash;
    delete payload.resetOtpExpiresAt;
    delete payload.resetOtpAttempts;
    delete payload.resetOtpLastSentAt;
    delete payload.resetOtpResendCount;
    delete payload.passwordResetToken;
    delete payload.passwordResetTokenExpiresAt;
    return payload;
};

exports.signup = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ con: false, msg: 'Email and password are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ con: false, msg: 'Password must be at least 8 characters' });
    }

    try {
        let user = await User.findOne({ email });

        if (user && user.isEmailVerified) {
            return res.status(409).json({ con: false, msg: 'User already exists. Please login.' });
        }

        const retryAfterSec = user ? getRetryAfterSec(user.emailOtpLastSentAt) : 0;
        if (retryAfterSec > 0) {
            return res.status(429).json({
                con: false,
                msg: 'Please wait before requesting another OTP',
                retryAfterSec
            });
        }

        if (user && user.emailOtpResendCount >= OTP_MAX_RESEND_COUNT) {
            return res.status(429).json({
                con: false,
                msg: 'Too many OTP requests. Please try again later.',
                retryAfterSec: OTP_TTL_MINUTES * 60
            });
        }

        if (!user) {
            user = new User({
                email,
                password,
                isEmailVerified: false
            });
        } else {
            user.password = password;
        }

        const otp = generateOtp();
        user.emailOtpHash = hashOtp(otp);
        user.emailOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        user.emailOtpAttempts = 0;
        user.emailOtpLastSentAt = new Date();
        user.emailOtpResendCount = (user.emailOtpResendCount || 0) + 1;

        await user.save();

        try {
            await sendOtpEmail({
                to: email,
                otp,
                expiresInMinutes: OTP_TTL_MINUTES
            });
        } catch (mailErr) {
            console.error(mailErr);
            return res.status(500).json({ con: false, msg: 'Failed to send OTP' });
        }

        res.status(201).json({
            con: true,
            msg: 'OTP sent to your email',
            data: {
                email,
                expiresInSec: OTP_TTL_MINUTES * 60,
                resendAfterSec: 60
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};

exports.verifyEmailOtp = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();

    if (!email || !otp) {
        return res.status(400).json({ con: false, msg: 'Email and OTP are required' });
    }

    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ con: false, msg: 'Invalid or expired OTP' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(409).json({ con: false, msg: 'Email already verified. Please login.' });
        }

        const isExpired = !user.emailOtpExpiresAt || new Date(user.emailOtpExpiresAt).getTime() < Date.now();
        if (!user.emailOtpHash || isExpired) {
            return res.status(400).json({ con: false, msg: 'Invalid or expired OTP' });
        }

        if ((user.emailOtpAttempts || 0) >= OTP_MAX_ATTEMPTS) {
            return res.status(429).json({
                con: false,
                msg: 'Too many failed attempts. Request a new OTP.',
                retryAfterSec: Math.ceil((new Date(user.emailOtpExpiresAt).getTime() - Date.now()) / 1000)
            });
        }

        const isValid = hashOtp(otp) === user.emailOtpHash;
        if (!isValid) {
            user.emailOtpAttempts = (user.emailOtpAttempts || 0) + 1;
            await user.save();

            if (user.emailOtpAttempts >= OTP_MAX_ATTEMPTS) {
                return res.status(429).json({
                    con: false,
                    msg: 'Too many failed attempts. Request a new OTP.',
                    retryAfterSec: Math.ceil((new Date(user.emailOtpExpiresAt).getTime() - Date.now()) / 1000)
                });
            }

            return res.status(400).json({ con: false, msg: 'Invalid or expired OTP' });
        }

        user.isEmailVerified = true;
        user.emailOtpHash = null;
        user.emailOtpExpiresAt = null;
        user.emailOtpAttempts = 0;
        user.emailOtpLastSentAt = null;
        user.emailOtpResendCount = 0;

        await user.save();

        const token = generateToken(user);

        res.json({
            con: true,
            msg: 'Email verified successfully',
            token,
            user: getPublicUser(user)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};

exports.resendEmailOtp = async (req, res) => {
    const email = normalizeEmail(req.body.email);

    if (!email) {
        return res.status(400).json({ con: false, msg: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(409).json({ con: false, msg: 'Email already verified. Please login.' });
        }

        const retryAfterSec = getRetryAfterSec(user.emailOtpLastSentAt);
        if (retryAfterSec > 0) {
            return res.status(429).json({
                con: false,
                msg: 'Please wait before requesting another OTP',
                retryAfterSec
            });
        }

        if ((user.emailOtpResendCount || 0) >= OTP_MAX_RESEND_COUNT) {
            return res.status(429).json({
                con: false,
                msg: 'Too many OTP requests. Please try again later.',
                retryAfterSec: OTP_TTL_MINUTES * 60
            });
        }

        const otp = generateOtp();
        user.emailOtpHash = hashOtp(otp);
        user.emailOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        user.emailOtpAttempts = 0;
        user.emailOtpLastSentAt = new Date();
        user.emailOtpResendCount = (user.emailOtpResendCount || 0) + 1;

        await user.save();

        try {
            await sendOtpEmail({
                to: email,
                otp,
                expiresInMinutes: OTP_TTL_MINUTES
            });
        } catch (mailErr) {
            console.error(mailErr);
            return res.status(500).json({ con: false, msg: 'Failed to send OTP' });
        }

        res.json({
            con: true,
            msg: 'OTP resent successfully',
            data: {
                email,
                expiresInSec: OTP_TTL_MINUTES * 60,
                resendAfterSec: 60
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};

exports.updateInterests = async (req, res) => {
    const { prefer_genres } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        user.prefer_genres = prefer_genres;
        await user.save();

        res.json({ con: true, msg: 'Interests updated successfully', user: getPublicUser(user) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    const { name, phone, dateOfBirth } = req.body;
    const photo = req.body.photo;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (photo) user.photo = photo;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;

        await user.save();

        res.json({ con: true, msg: 'Profile updated successfully', user: getPublicUser(user) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ con: false, msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ con: false, msg: 'Invalid Credentials' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ con: false, msg: 'Email not verified. Please verify OTP first.' });
        }

        const token = generateToken(user);

        res.json({ con: true, msg: 'Login successful', token, user: getPublicUser(user) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
            }
            user.isEmailVerified = true;
            await user.save();
        } else {
            user = new User({
                name,
                email,
                googleId,
                password: '',
                isEmailVerified: true
            });
            await user.save();
        }

        const jwtToken = generateToken(user);
        res.json({ con: true, msg: 'Google login successful', token: jwtToken, user: getPublicUser(user) });
    } catch (err) {
        console.error(err);
        res.status(400).json({ con: false, msg: 'Google login failed' });
    }
};

exports.facebookLogin = async (req, res) => {
    const { accessToken, userID } = req.body;

    try {
        const verifyUrl = `https://graph.facebook.com/v21.0/me?fields=name,email&access_token=${accessToken}`;
        const response = await axios.get(verifyUrl);

        const { name, email, id } = response.data;

        if (id !== userID) {
            return res.status(400).json({ con: false, msg: 'Invalid Facebook Token' });
        }

        let user = await User.findOne({
            $or: [{ facebookId: id }, { email }]
        });

        if (user) {
            if (!user.facebookId) {
                user.facebookId = id;
            }
            user.isEmailVerified = true;
            await user.save();
        } else {
            user = new User({
                name,
                email,
                facebookId: id,
                password: '',
                isEmailVerified: true
            });
            await user.save();
        }

        const token = generateToken(user);
        res.json({ con: true, msg: 'Facebook login successful', token, user: getPublicUser(user) });
    } catch (err) {
        console.error(err);
        res.status(400).json({ con: false, msg: 'Facebook login failed' });
    }
};

exports.githubLogin = async (req, res) => {
    const { code } = req.body;

    try {
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: { Accept: 'application/json' }
        });

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            return res.status(400).json({ con: false, msg: 'Invalid GitHub Code' });
        }

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { name, email, id, login } = userResponse.data;
        let userEmail = email;

        if (!userEmail) {
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const primaryEmail = emailResponse.data.find((e) => e.primary && e.verified);
            userEmail = primaryEmail ? primaryEmail.email : null;
        }

        if (!userEmail) {
            return res.status(400).json({ con: false, msg: 'GitHub email not found or private' });
        }

        let user = await User.findOne({
            $or: [{ githubId: id.toString() }, { email: userEmail }]
        });

        if (user) {
            if (!user.githubId) {
                user.githubId = id.toString();
            }
            user.isEmailVerified = true;
            await user.save();
        } else {
            user = new User({
                name: name || login,
                email: userEmail,
                githubId: id.toString(),
                password: '',
                isEmailVerified: true
            });
            await user.save();
        }

        const token = generateToken(user);
        res.json({ con: true, msg: 'GitHub login successful', token, user: getPublicUser(user) });
    } catch (err) {
        console.error(err);
        res.status(400).json({ con: false, msg: 'GitHub login failed' });
    }
};

const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

exports.forgotPassword = async (req, res) => {
    const email = normalizeEmail(req.body.email);

    if (!email) {
        return res.status(400).json({ con: false, msg: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ con: false, msg: 'No account found with this email' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ con: false, msg: 'Email not verified. Please verify your email first.' });
        }

        const retryAfterSec = getRetryAfterSec(user.resetOtpLastSentAt);
        if (retryAfterSec > 0) {
            return res.status(429).json({
                con: false,
                msg: 'Please wait before requesting another reset code',
                retryAfterSec
            });
        }

        if ((user.resetOtpResendCount || 0) >= OTP_MAX_RESEND_COUNT) {
            return res.status(429).json({
                con: false,
                msg: 'Too many reset code requests. Please try again later.',
                retryAfterSec: OTP_TTL_MINUTES * 60
            });
        }

        const otp = generateOtp();
        user.resetOtpHash = hashOtp(otp);
        user.resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        user.resetOtpAttempts = 0;
        user.resetOtpLastSentAt = new Date();
        user.resetOtpResendCount = (user.resetOtpResendCount || 0) + 1;
        user.passwordResetToken = null;
        user.passwordResetTokenExpiresAt = null;

        await user.save();

        try {
            await sendPasswordResetEmail({
                to: email,
                otp,
                expiresInMinutes: OTP_TTL_MINUTES
            });
        } catch (mailErr) {
            console.error(mailErr);
            return res.status(500).json({ con: false, msg: 'Failed to send reset code' });
        }

        res.json({
            con: true,
            msg: 'Password reset code sent to your email',
            data: {
                email,
                expiresInSec: OTP_TTL_MINUTES * 60,
                resendAfterSec: 60
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};

exports.resendResetOtp = async (req, res) => {
    const email = normalizeEmail(req.body.email);

    if (!email) {
        return res.status(400).json({ con: false, msg: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ con: false, msg: 'Email not verified. Please verify your email first.' });
        }

        // Guard: forgot-password must have been called at least once
        if (!user.resetOtpResendCount && !user.resetOtpHash) {
            return res.status(400).json({ con: false, msg: 'No active password reset request. Please request a reset code first.' });
        }

        const retryAfterSec = getRetryAfterSec(user.resetOtpLastSentAt);
        if (retryAfterSec > 0) {
            return res.status(429).json({
                con: false,
                msg: 'Please wait before requesting another reset code',
                retryAfterSec
            });
        }

        if ((user.resetOtpResendCount || 0) >= OTP_MAX_RESEND_COUNT) {
            return res.status(429).json({
                con: false,
                msg: 'Too many reset code requests. Please try again later.',
                retryAfterSec: OTP_TTL_MINUTES * 60
            });
        }

        const otp = generateOtp();
        user.resetOtpHash = hashOtp(otp);
        user.resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        user.resetOtpAttempts = 0;
        user.resetOtpLastSentAt = new Date();
        user.resetOtpResendCount = (user.resetOtpResendCount || 0) + 1;
        user.passwordResetToken = null;
        user.passwordResetTokenExpiresAt = null;

        await user.save();

        try {
            await sendPasswordResetEmail({
                to: email,
                otp,
                expiresInMinutes: OTP_TTL_MINUTES
            });
        } catch (mailErr) {
            console.error(mailErr);
            return res.status(500).json({ con: false, msg: 'Failed to send reset code' });
        }

        res.json({
            con: true,
            msg: 'Reset code resent successfully',
            data: {
                email,
                expiresInSec: OTP_TTL_MINUTES * 60,
                resendAfterSec: 60
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};

exports.verifyResetOtp = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();

    if (!email || !otp) {
        return res.status(400).json({ con: false, msg: 'Email and OTP are required' });
    }

    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ con: false, msg: 'Invalid or expired reset code' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        const isExpired = !user.resetOtpExpiresAt || new Date(user.resetOtpExpiresAt).getTime() < Date.now();
        if (!user.resetOtpHash || isExpired) {
            return res.status(400).json({ con: false, msg: 'Invalid or expired reset code' });
        }

        if ((user.resetOtpAttempts || 0) >= OTP_MAX_ATTEMPTS) {
            return res.status(429).json({
                con: false,
                msg: 'Too many failed attempts. Request a new reset code.',
                retryAfterSec: Math.ceil((new Date(user.resetOtpExpiresAt).getTime() - Date.now()) / 1000)
            });
        }

        const isValid = hashOtp(otp) === user.resetOtpHash;
        if (!isValid) {
            user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
            await user.save();

            if (user.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
                return res.status(429).json({
                    con: false,
                    msg: 'Too many failed attempts. Request a new reset code.',
                    retryAfterSec: Math.ceil((new Date(user.resetOtpExpiresAt).getTime() - Date.now()) / 1000)
                });
            }

            return res.status(400).json({ con: false, msg: 'Invalid or expired reset code' });
        }

        // OTP is valid — issue a short-lived reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        user.resetOtpHash = null;
        user.resetOtpExpiresAt = null;
        user.resetOtpAttempts = 0;
        user.resetOtpLastSentAt = null;
        user.resetOtpResendCount = 0;

        await user.save();

        res.json({
            con: true,
            msg: 'Reset code verified successfully',
            data: {
                resetToken,
                expiresInSec: RESET_TOKEN_TTL_MS / 1000
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};

exports.resetPassword = async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
        return res.status(400).json({ con: false, msg: 'Email, reset token, and new password are required' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ con: false, msg: 'Password must be at least 8 characters' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ con: false, msg: 'User not found' });
        }

        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const isTokenValid = user.passwordResetToken === tokenHash;
        const isTokenExpired = !user.passwordResetTokenExpiresAt ||
            new Date(user.passwordResetTokenExpiresAt).getTime() < Date.now();

        if (!isTokenValid || isTokenExpired) {
            return res.status(400).json({ con: false, msg: 'Invalid or expired reset token' });
        }

        user.password = newPassword;
        user.passwordResetToken = null;
        user.passwordResetTokenExpiresAt = null;

        await user.save();

        res.json({
            con: true,
            msg: 'Password reset successfully. You can now login with your new password.'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ con: false, msg: 'Server Error' });
    }
};
