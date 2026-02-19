const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.signup = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ con: false, msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            phone
        });

        await user.save();

        const token = generateToken(user);

        res.status(201).json({ con: true, msg: 'User registered successfully', token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ con: false, msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ con: false, msg: 'Invalid Credentials' });
        }

        const token = generateToken(user);

        res.json({ con: true, msg: 'Login successful', token, user });
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
            // If user exists but doesn't have googleId (e.g. signed up with email/password), link it
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                googleId,
                password: '' // No password for OAuth users
            });
            await user.save();
        }

        const jwtToken = generateToken(user);
        res.json({ con: true, msg: 'Google login successful', token: jwtToken, user });

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
            $or: [{ facebookId: id }, { email: email }]
        });

        if (user) {
            if (!user.facebookId) {
                user.facebookId = id;
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                facebookId: id,
                password: ''
            });
            await user.save();
        }

        const token = generateToken(user);
        res.json({ con: true, msg: 'Facebook login successful', token, user });

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
            const primaryEmail = emailResponse.data.find(e => e.primary && e.verified);
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
                await user.save();
            }
        } else {
            user = new User({
                name: name || login,
                email: userEmail,
                githubId: id.toString(),
                password: ''
            });
            await user.save();
        }

        const token = generateToken(user);
        res.json({ con: true, msg: 'GitHub login successful', token, user });

    } catch (err) {
        console.error(err);
        res.status(400).json({ con: false, msg: 'GitHub login failed' });
    }
};
