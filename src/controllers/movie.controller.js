const { syncWeeklyNowPlaying } = require('../services/weeklySync.service');
const { formatMessage } = require("../utils/utils");
const TimeSlot = require("../models/timeSlot.model");
const Movie = require("../models/movie.model");
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
    const result = await Movie.find().sort({ createdAt: -1 });
    formatMessage(res, "Now Playing Movie", result);
});

module.exports = {
    syncNowPlaying,
    getCinemasByMovie,
    getNowPlayingMovie
};
