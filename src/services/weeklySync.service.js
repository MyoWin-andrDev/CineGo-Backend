const Movie = require('../models/movie.model');
const TimeSlot = require('../models/timeSlot.model');
const Cinema = require('../models/cinema.model');
const Hall = require('../models/hall.model');
const { getNowPlaying } = require('./tmdb.service');
const { saveMovies } = require('./movie.service');
const { addDays, setTime } = require('../utils/time.utils');

const REQUIRED_MOVIE_COUNT = 2;
const REQUIRED_CINEMA_COUNT = 2;
const DAYS_TO_SCHEDULE = 7;
const STANDARD_SLOTS = [
    { hour: 10, price: 7.5 },
    { hour: 16, price: 7.5 }
];

const syncWeeklyNowPlaying = async () => {
    const tmdbNowPlaying = await getNowPlaying();
    const firstFiveMovies = tmdbNowPlaying.slice(0, REQUIRED_MOVIE_COUNT);

    if (firstFiveMovies.length < REQUIRED_MOVIE_COUNT) {
        throw new Error(`TMDB returned only ${firstFiveMovies.length} movies. Need 5 movies to build weekly schedule.`);
    }

    const cinemas = await Cinema.find().sort({ name: 1 }).limit(REQUIRED_CINEMA_COUNT);
    if (cinemas.length < REQUIRED_CINEMA_COUNT) {
        throw new Error(`Found only ${cinemas.length} cinemas. Need 5 cinemas to assign 5 movies.`);
    }

    const cinemaIds = cinemas.map((cinema) => cinema._id);
    const halls = await Hall.find({ cinema: { $in: cinemaIds } }).sort({ cinema: 1, createdAt: 1 });
    if (!halls.length) {
        throw new Error('No halls found for selected cinemas.');
    }

    const hallsByCinema = new Map();
    halls.forEach((hall) => {
        const key = hall.cinema.toString();
        if (!hallsByCinema.has(key)) {
            hallsByCinema.set(key, []);
        }
        hallsByCinema.get(key).push(hall);
    });

    const cinemasWithoutHalls = cinemas.filter((cinema) => !hallsByCinema.has(cinema._id.toString()));
    if (cinemasWithoutHalls.length) {
        throw new Error(`Some cinemas have no halls: ${cinemasWithoutHalls.map((c) => c.name).join(', ')}`);
    }

    await TimeSlot.deleteMany({});
    await Movie.deleteMany({});

    const savedMovies = [];
    for (const movie of firstFiveMovies) {
        const savedMovie = await saveMovies(movie);
        savedMovies.push(savedMovie);
    }

    const assignment = cinemas.map((cinema, index) => ({
        cinema,
        movie: savedMovies[index]
    }));

    const weekStart = setTime(new Date(), 0, 0);
    const newTimeSlots = [];

    for (let day = 0; day < DAYS_TO_SCHEDULE; day++) {
        const showDate = addDays(weekStart, day);

        assignment.forEach(({ cinema, movie }) => {
            const cinemaHalls = hallsByCinema.get(cinema._id.toString());

            cinemaHalls.forEach((hall) => {
                STANDARD_SLOTS.forEach((slot) => {
                    const startTime = setTime(showDate, slot.hour);
                    const endTime = setTime(showDate, slot.hour + 2);

                    newTimeSlots.push({
                        movie: movie._id,
                        hall: hall._id,
                        show_date: showDate,
                        start_time: startTime,
                        end_time: endTime,
                        base_price: slot.price
                    });
                });
            });
        });
    }

    await TimeSlot.insertMany(newTimeSlots, { ordered: false });

    return {
        movies: savedMovies,
        assignment: assignment.map(({ cinema, movie }) => ({
            cinemaId: cinema._id,
            cinemaName: cinema.name,
            movieId: movie._id,
            movieTitle: movie.title
        }))
    };
};

module.exports = { syncWeeklyNowPlaying };
