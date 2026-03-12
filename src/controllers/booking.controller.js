const asyncHandler = require('../utils/asyncHandler');
const { formatMessage } = require('../utils/utils');
const { createBooking } = require('../services/booking.service');

const createShowtimeBooking = asyncHandler(async (req, res) => {
    const { showtimeId, seats } = req.body;
    const userId = req.user?.id || null;

    const booking = await createBooking({
        showtimeId,
        seats,
        userId
    });

    formatMessage(res, 'Booking created', booking, 201);
});

module.exports = {
    createShowtimeBooking
};
