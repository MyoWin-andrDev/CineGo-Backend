const { getNowPlaying } = require('../services/tmdb.service');
const { saveMovies } = require('../services/movie.service');
const { generateTimeSlots } = require('../services/timeslot.service');
const { formatMessage } = require("../utils/utils");
const TimeSlot = require("../models/timeSlot.model");
const Movie = require("../models/movie.model");

const syncNowPlaying = async (req, res) => {
    const movies = await getNowPlaying();
    const firstFiveMovies = movies.slice(0, 5);

    const savedMovies = [];

    for (const movie of firstFiveMovies) {
        const savedMovie = await saveMovies(movie);
        savedMovies.push(savedMovie);
    }

    // Generate timeslots
    await generateTimeSlots(savedMovies);

    formatMessage(res, "Movies & TimeSlots synced", savedMovies);
};

const getCinemasByMovie = async (req, res) => {
    const { movieId } = req.params;

    const slots = await TimeSlot.find({ movie: movieId })
        .populate({
            path: 'hall',
            populate: { path: 'cinema' }
        });
    console.log(slots)
    const cinemaMap = new Map();
    slots.forEach(slot => {
        // guard clauses
        if (!slot.hall) return;
        if (!slot.hall.cinema) return;

        const cinema = slot.hall.cinema;
        cinemaMap.set(cinema._id.toString(), cinema);
    });

    formatMessage(res, "Cinemas Showing Movie", [...cinemaMap.values()]);
};


let getNowPlayingMovie = async (req, res) => {
    let result = await Movie.find()
    formatMessage(res, "Now Playing Movie", result)
}

module.exports = {
    syncNowPlaying,
    getCinemasByMovie,
    getNowPlayingMovie
};
