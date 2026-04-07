const mongoose = require('mongoose');
const Movie = require('../models/nowPlayingMovie.model');
const Review = require('../models/review.model');

const validateMovieId = (movieId) => {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        const err = new Error('Invalid movieId');
        err.statusCode = 400;
        throw err;
    }
};

const validateRating = (rating) => {
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
        const err = new Error('Rating must be an integer between 1 and 10');
        err.statusCode = 400;
        throw err;
    }
};

const recalculateMovieUserRatings = async (movieId) => {
    const aggregation = await Review.aggregate([
        { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
        {
            $group: {
                _id: '$movie',
                average: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    const userRatingAverage = aggregation.length ? Number(aggregation[0].average.toFixed(2)) : 0;
    const userRatingCount = aggregation.length ? aggregation[0].count : 0;

    await Movie.findByIdAndUpdate(movieId, {
        userRatingAverage,
        userRatingCount
    });

    return { userRatingAverage, userRatingCount };
};

const upsertMovieRating = async ({ movieId, userId, rating }) => {
    validateMovieId(movieId);
    validateRating(rating);

    const movie = await Movie.findById(movieId);
    if (!movie) {
        const err = new Error('Now Playing movie not found. Upcoming movies cannot be rated.');
        err.statusCode = 404;
        throw err;
    }

    const review = await Review.findOneAndUpdate(
        { movie: movieId, user: userId },
        { movie: movieId, user: userId, rating },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const summary = await recalculateMovieUserRatings(movieId);

    return {
        movieId,
        rating: review.rating,
        userRatingAverage: summary.userRatingAverage,
        userRatingCount: summary.userRatingCount
    };
};

const getMovieRatingSummary = async (movieId) => {
    validateMovieId(movieId);

    const movie = await Movie.findById(movieId).select('_id userRatingAverage userRatingCount');
    if (!movie) {
        const err = new Error('Now Playing movie not found. Upcoming movies cannot be rated.');
        err.statusCode = 404;
        throw err;
    }

    return {
        movieId: movie._id,
        userRatingAverage: movie.userRatingAverage || 0,
        userRatingCount: movie.userRatingCount || 0
    };
};

const getMyMovieRating = async ({ movieId, userId }) => {
    validateMovieId(movieId);

    const movie = await Movie.findById(movieId).select('_id');
    if (!movie) {
        const err = new Error('Now Playing movie not found. Upcoming movies cannot be rated.');
        err.statusCode = 404;
        throw err;
    }

    const review = await Review.findOne({ movie: movieId, user: userId }).select('rating');

    return {
        movieId: movie._id,
        rating: review ? review.rating : null
    };
};

module.exports = {
    upsertMovieRating,
    getMovieRatingSummary,
    getMyMovieRating
};
