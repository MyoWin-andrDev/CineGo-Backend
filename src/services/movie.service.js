const Movie = require('../models/movie.model');
const {getTeaser, getImages, getGenres, getCasters} = require('../services/tmdb.service');
const { extractTeasers } = require('../mappers/teaser.mapper');
const { extractImages} = require('../mappers/image.mapper');
const {extractCast} = require("../mappers/caster.mapper");
const {extractGenre} = require("../mappers/genre.mapper");

const saveMovies = async (tmdbMovies) => {
    let [videos, images, genres, casters] = await Promise.all([
        getTeaser(tmdbMovies.id),
        getImages(tmdbMovies.id),
        getGenres(tmdbMovies.id),
        getCasters(tmdbMovies.id)
    ]);

    videos = extractTeasers(videos);
    images  = extractImages(images);
    genres = extractGenre(genres)
    casters = extractCast(casters);

    return Movie.findOneAndUpdate(
        { tmdbId: tmdbMovies.id },
        {
            tmdbId: tmdbMovies.id,
            title: tmdbMovies.title,
            releaseDate: tmdbMovies.release_date,
            rating: tmdbMovies.vote_average,
            overview: tmdbMovies.overview,
            posterPath: tmdbMovies.poster_path,
            backdropPath: tmdbMovies.backdrop_path,
            teaser: videos,
            images: images,
            genres : genres,
            casters : casters
        },
        { upsert: true, new: true }
    );
}

module.exports = {
    saveMovies
}
