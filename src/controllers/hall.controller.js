const Hall = require('../models/hall.model');
const { formatMessage } = require('../utils/utils');

const createHallInCinema = async (req, res) => {
    let result = await new Hall(req.body).save()
    formatMessage(res, "Hall Successfully added to cinema ", result)
}

let getAllHall = async (req, res) => {
    let result = await Hall.find();
    formatMessage(res, "Get All Halls", result)
}

module.exports = {
    createHallInCinema,
    getAllHall
};