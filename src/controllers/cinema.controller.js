const Cinema = require('../models/cinema.model');
const Hall = require('../models/hall.model');
const { formatMessage } = require('../utils/utils');

const createCinema = async (req, res) => {
    const cinema = await Cinema.create(req.body);

    // auto-create IMAX hall
    await Hall.create({
        cinema: cinema._id,
        hallName: 'IMAX',
        totalSeats: 110
    });

    formatMessage(res, "Cinema created with IMAX hall", cinema);
};

const getCinemas = async (req, res) => {
    const cinemas = await Cinema.find();
    formatMessage(res, "Get All Cinemas", cinemas);
};

module.exports = {
    createCinema,
    getCinemas
};
