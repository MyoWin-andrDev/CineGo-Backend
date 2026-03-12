const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');

router.post('/', bookingController.createShowtimeBooking);

module.exports = router;
