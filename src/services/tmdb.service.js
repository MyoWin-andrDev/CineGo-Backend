require('dotenv').config();

const axios = require('axios');
const { baseUrl, accessToken } = require('../config/tmdb');

const tmdbClient = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
        Authorization: accessToken,
    }
});

let getNowPlaying = async () => {
    const response = await tmdbClient.get(process.env.TMDB_NOW_PLAYING_ENDPOINT);
    return response.data.results;
}

let getUpcoming = async () => {
    const configuredEndpoint = process.env.TMDB_UP_COMING_ENDPOINT || '/movie/upcoming';
    const normalizedEndpoint = configuredEndpoint.replace('/up_coming', '/upcoming');
    const response = await tmdbClient.get(normalizedEndpoint);
    return response.data.results;
}

let getTeaser = async (movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}/videos`);
    return response.data.results;
}
let getTrailer= async (movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}/videos`);
    return response.data.results;
}


let getImages = async(movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}/images`);
    return response.data.backdrops;
}

let getGenres = async (movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}`);
    return response.data.genres;
    
}

let getCasters = async(movieId) => {
    const response = await tmdbClient.get(`/movie/${movieId}/credits`);
    return response.data.cast
}

module.exports = {
    getNowPlaying,
    getUpcoming,
    getTeaser,
    getImages,
    getGenres,
    getCasters,
    getTrailer
}
