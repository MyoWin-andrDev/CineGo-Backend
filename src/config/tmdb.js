require('dotenv').config();

module.exports = {
    baseUrl: process.env.TMDB_BASE_URL,
    accessToken: process.env.TMDB_ACCESS_TOKEN
};
