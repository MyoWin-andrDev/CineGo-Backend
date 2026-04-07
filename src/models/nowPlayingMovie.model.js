const mongoose = require('mongoose');
const movieSchema = require('./schemas/movie.schema');

const nowPlayingMovieSchema = movieSchema.clone();

nowPlayingMovieSchema.add({
    userRatingAverage: { type: Number, default: 0 },
    userRatingCount: { type: Number, default: 0 }
});

const nowPlayingMovieModel = mongoose.model('now_playing_movie', nowPlayingMovieSchema);

module.exports = nowPlayingMovieModel
