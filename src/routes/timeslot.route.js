const router = require('express').Router();
const timeslotController = require('../controllers/timeslot.controller');

router.get(
    '/:movieId/cinema/:cinemaId',
    timeslotController.getTimeSlotsByMovieAndCinema
);

module.exports = router;
