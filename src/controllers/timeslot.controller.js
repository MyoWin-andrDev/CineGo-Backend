const TimeSlot = require('../models/timeSlot.model');
const { formatMessage } = require('../utils/utils');
const asyncHandler = require('../utils/asyncHandler');
const { getTimeSlotSeatAvailability } = require('../services/booking.service');

const getTimeSlotsByMovieAndCinema = asyncHandler(async (req, res) => {
    const { movieId, cinemaId } = req.params;

    const slots = await TimeSlot.find({ movie: movieId })
        .populate({
            path: 'hall',
            match: { cinema: cinemaId },
            populate: { path: 'cinema' }
        })
        .sort({ show_date: 1, start_time: 1 });

    // remove null halls (populate + match)
    const filtered = slots.filter(slot => slot.hall);

    formatMessage(res, "TimeSlots", filtered);
});

const getSeatAvailability = asyncHandler(async (req, res) => {
    const { timeslotId } = req.params;
    const result = await getTimeSlotSeatAvailability(timeslotId);
    formatMessage(res, 'Seat availability', result);
});

module.exports = {
    getTimeSlotsByMovieAndCinema,
    getSeatAvailability
};
