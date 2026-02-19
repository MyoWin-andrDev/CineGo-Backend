const TimeSlot = require('../models/timeSlot.model');
const { formatMessage } = require('../utils/utils');

const getTimeSlotsByMovieAndCinema = async (req, res) => {
    const { movieId, cinemaId } = req.params;

    const slots = await TimeSlot.find({ movie: movieId })
        .populate({
            path: 'hall',
            match: { cinema: cinemaId }
        })
        .sort({ show_date: 1, start_time: 1 });

    // remove null halls (populate + match)
    const filtered = slots.filter(slot => slot.hall);

    formatMessage(res, "TimeSlots", filtered);
};

module.exports = {
    getTimeSlotsByMovieAndCinema
};
