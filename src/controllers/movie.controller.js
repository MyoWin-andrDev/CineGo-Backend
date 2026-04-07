const { syncWeeklyNowPlaying } = require('../services/weeklySync.service');
const { upsertMovieRating, getMovieRatingSummary, getMyMovieRating } = require('../services/review.service');
const { formatMessage } = require("../utils/utils");
const TimeSlot = require("../models/timeSlot.model");
const mongoose = require('mongoose');
const NowPlayingMovie = require("../models/nowPlayingMovie.model");
const UpcomingMovie = require("../models/upcomingMovie.model");
const asyncHandler = require('../utils/asyncHandler');

const syncNowPlaying = asyncHandler(async (req, res) => {
    const result = await syncWeeklyNowPlaying();
    formatMessage(res, "Movies & TimeSlots synced", result);
});

const getCinemasByMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    const slots = await TimeSlot.find({ movie: movieId })
        .populate({
            path: 'hall',
            populate: { path: 'cinema' }
        });

    const cinemaMap = new Map();
    slots.forEach(slot => {
        // guard clauses
        if (!slot.hall) return;
        if (!slot.hall.cinema) return;

        const cinema = slot.hall.cinema;
        cinemaMap.set(cinema._id.toString(), cinema);
    });

    formatMessage(res, "Cinemas Showing Movie", [...cinemaMap.values()]);
});


const getNowPlayingMovie = asyncHandler(async (req, res) => {
    const result = await NowPlayingMovie.find().sort({ createdAt: -1 });
    formatMessage(res, "Now Playing Movie", result);
});

const getUpcomingMovie = asyncHandler(async (req, res) => {
    const result = await UpcomingMovie.find().sort({ createdAt: -1 });
    formatMessage(res, "Coming Soon Movie", result);
});

const getNowPlayingMovieDetailById = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({
            con: false,
            conn: false,
            msg: 'Invalid movieId',
            result: null
        });
    }

    const result = await NowPlayingMovie.findById(movieId);
    if (!result) {
        return res.status(404).json({
            con: false,
            conn: false,
            msg: 'Now Playing movie not found',
            result: null
        });
    }

    formatMessage(res, "Now Playing Movie Detail", result);
});

const getUpcomingMovieDetailById = asyncHandler(async (req, res) => {
    const { movieId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({
            con: false,
            conn: false,
            msg: 'Invalid movieId',
            result: null
        });
    }

    const result = await UpcomingMovie.findById(movieId);
    if (!result) {
        return res.status(404).json({
            con: false,
            conn: false,
            msg: 'Upcoming movie not found',
            result: null
        });
    }

    formatMessage(res, "Upcoming Movie Detail", result);
});

const rateMovie = asyncHandler(async (req, res) => {
    try {
        const { movieId } = req.params;
        const { rating } = req.body;

        const result = await upsertMovieRating({
            movieId,
            userId: req.user.id,
            rating
        });

        return res.status(200).json({
            conn: true,
            msg: "Rating submitted successfully",
            result
        });
    } catch (error) {
        return res.status(error.statusCode || error.status || 500).json({
            conn: false,
            msg: error.message || "Failed to submit rating",
            result: null
        });
    }
});

const getMovieRating = asyncHandler(async (req, res) => {
    try {
        const { movieId } = req.params;
        const result = await getMovieRatingSummary(movieId);

        return res.status(200).json({
            conn: true,
            msg: "Movie rating summary",
            result
        });
    } catch (error) {
        return res.status(error.statusCode || error.status || 500).json({
            conn: false,
            msg: error.message || "Failed to fetch movie rating summary",
            result: null
        });
    }
});

const getMyRating = asyncHandler(async (req, res) => {
    try {
        const { movieId } = req.params;
        const result = await getMyMovieRating({
            movieId,
            userId: req.user.id
        });

        return res.status(200).json({
            conn: true,
            msg: "My movie rating",
            result
        });
    } catch (error) {
        return res.status(error.statusCode || error.status || 500).json({
            conn: false,
            msg: error.message || "Failed to fetch my movie rating",
            result: null
        });
    }
});

module.exports = {
    syncNowPlaying,
    getCinemasByMovie,
    getNowPlayingMovie,
    getUpcomingMovie,
    getNowPlayingMovieDetailById,
    getUpcomingMovieDetailById,
    rateMovie,
    getMovieRating,
    getMyRating
};
