const Cinema = require('../models/cinema.model');
const Hall = require('../models/hall.model');
const TimeSlot = require('../models/timeSlot.model');
const { formatMessage } = require('../utils/utils');
const asyncHandler = require('../utils/asyncHandler');

const createCinema = asyncHandler(async (req, res) => {
    const cinema = await Cinema.create(req.body);
    // auto-create IMAX hall
    await Hall.create({
        cinema: cinema._id,
        hallName: 'IMAX',
        totalSeats: 110
    });

    formatMessage(res, "Cinema created with IMAX hall", cinema);
});

const getCinemas = asyncHandler(async (req, res) => {
    const cinemas = await Cinema.find().sort({ name: 1 });
    formatMessage(res, "Get All Cinemas", cinemas);
});

const getCinemaTimeSlots = asyncHandler(async (req, res) => {
    // Return all timeslots unconditionally; client filters using populated document metadata
    const slots = await TimeSlot.find()
        .populate('movie')
        .populate('hall')
        .sort({ start_time: 1 });

    // Return raw populated timeslots list
    formatMessage(res, "Cinema Timeslots", slots);
});

module.exports = {
    createCinema,
    getCinemas,
    getCinemaTimeSlots
};
