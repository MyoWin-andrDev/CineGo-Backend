const asyncHandler = require('../utils/asyncHandler');
const { formatMessage } = require('../utils/utils');
const { createBooking } = require('../services/booking.service');

const createTimeslotBooking = asyncHandler(async (req, res) => {
    const { timeslotId, seats } = req.body;
    const userId = req.user?.id || null;

    const booking = await createBooking({
        timeslotId,
        seats,
        userId
    });

    formatMessage(res, 'Booking created', booking, 201);
});

module.exports = {
    createTimeslotBooking
};
