const cinemaController = require('../controllers/cinema.controller');
const router = require('express').Router();

router.post('/create', cinemaController.createCinema);
router.get('/', cinemaController.getCinemas);
router.get('/:cinemaId/timeslots', cinemaController.getCinemaTimeSlots);

module.exports = router;