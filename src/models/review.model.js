const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    }
}, { timestamps: true });

reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

const reviewModel = mongoose.model('review', reviewSchema);

module.exports = reviewModel;
