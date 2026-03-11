const Cinema = require('../models/cinema.model');
const Hall = require('../models/hall.model');
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

module.exports = {
    createCinema,
    getCinemas
};
