const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');

router.post('/', bookingController.createTimeslotBooking);

module.exports = router;
