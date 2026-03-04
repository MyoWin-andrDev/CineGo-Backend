const mongoose = require('mongoose');
const {
    hashPassword,
    comparePassword
} = require('../utils/password.utils');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String }, // Required for non-OAuth users
    googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
    facebookId: { type: String, unique: true, sparse: true }, // For Facebook OAuth
    githubId: { type: String, unique: true, sparse: true }, // For GitHub OAuth
    photo: { type: String },
    phone: { type: String },
    prefer_genres: [{ type: String }],
    watchlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    try {
        this.password = await hashPassword(this.password);
    } catch (error) {
        throw error;
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await comparePassword(candidatePassword, this.password);
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
