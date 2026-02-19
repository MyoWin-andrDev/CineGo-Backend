const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    tmdbId : {type : Number},
    title: { type: String, default : "" },
    releaseDate: { type: Date, default: null },
    rating: { type: Number },
    overview : {type : String, default : "" },
    posterPath : {type : String, default : "" },
    backdropPath : {type : String, default : ""},
    teaser : {type : Array},
    images : {type : Array},
    genres : {type : Array},
    casters : {type : Array},
}, { timestamps: true });

const movieModel = mongoose.model('movie', movieSchema);

module.exports = movieModel
