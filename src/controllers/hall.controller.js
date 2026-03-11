const Hall = require('../models/hall.model');
const { formatMessage } = require('../utils/utils');
const asyncHandler = require('../utils/asyncHandler');

const createHallInCinema = asyncHandler(async (req, res) => {
    const result = await Hall.create(req.body);
    formatMessage(res, "Hall successfully added to cinema", result, 201);
});

const getAllHall = asyncHandler(async (req, res) => {
    const result = await Hall.find().sort({ createdAt: 1 });
    formatMessage(res, "Get All Halls", result);
});

module.exports = {
    createHallInCinema,
    getAllHall
};
