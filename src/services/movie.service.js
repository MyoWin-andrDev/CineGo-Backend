const Movie = require('../models/nowPlayingMovie.model');
const {getTeaser, getImages, getGenres, getCasters, getTrailer} = require('../services/tmdb.service');
const { extractTeasers } = require('../mappers/teaser.mapper');
const { extractImages} = require('../mappers/image.mapper');
const {extractCast} = require("../mappers/caster.mapper");
const {extractGenre} = require("../mappers/genre.mapper");
const {extractTrailer} = require("../mappers/trailer.mapper");


const buildMoviePayload = async (tmdbMovie) => {
    let [videos, images, genres, casters, trailerVideos] = await Promise.all([
        getTeaser(tmdbMovie.id),
        getImages(tmdbMovie.id),
        getGenres(tmdbMovie.id),
        getCasters(tmdbMovie.id),
        getTrailer(tmdbMovie.id)
    ]);

    // Keep teaser flow unchanged.
    videos = extractTeasers(videos);
    images  = extractImages(images);
    genres = extractGenre(genres);
    casters = extractCast(casters);
    // Trailer requirements:
    // - exactly one key (string)
    // - first YouTube Trailer only
    // - fallback to empty string
    const trailer = extractTrailer(trailerVideos);

    return {
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        releaseDate: tmdbMovie.release_date,
        rating: tmdbMovie.vote_average,
        voteAverage: tmdbMovie.vote_average,
        voteCount: tmdbMovie.vote_count,
        overview: tmdbMovie.overview,
        posterPath: tmdbMovie.poster_path,
        backdropPath: tmdbMovie.backdrop_path,
        trailer : trailer,
        teaser: videos,
        images: images,
        genres: genres,
        casters: casters
    };
}

const saveMovies = async (tmdbMovie, movieModel = Movie) => {
    const payload = await buildMoviePayload(tmdbMovie);

    return movieModel.findOneAndUpdate(
        { tmdbId: tmdbMovie.id },
        payload,
        { upsert: true, new: true }
    );
}

module.exports = {
    saveMovies
}
