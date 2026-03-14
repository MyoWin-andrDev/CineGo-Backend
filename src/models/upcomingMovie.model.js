const mongoose = require('mongoose');
const movieSchema = require('./schemas/movie.schema');

const upcomingMovieModel = mongoose.model('upcoming_movie', movieSchema);

module.exports = upcomingMovieModel;
