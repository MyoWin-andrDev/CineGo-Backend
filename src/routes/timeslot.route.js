const router = require('express').Router();
const timeslotController = require('../controllers/timeslot.controller');

router.get(
    '/:movieId/cinema/:cinemaId',
    timeslotController.getTimeSlotsByMovieAndCinema
);
router.get('/:timeslotId/seats', timeslotController.getSeatAvailability);

module.exports = router;
