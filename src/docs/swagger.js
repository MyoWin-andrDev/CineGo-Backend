const moviePaths = require('./paths/movie.path');
const cinemaPaths = require('./paths/cinema.path');
const hallPaths = require('./paths/hall.path');
const timeSlotPaths = require('./paths/timeslot.path');
const authPaths = require('./paths/auth.path');
const chatPaths = require('./paths/chat.path');

const movieSchema = require('./schemas/movie.schema');
const cinemaSchema = require('./schemas/cinema.schema');
const hallSchema = require('./schemas/hall.schema');
const timeSlotSchema = require('./schemas/timeslot.schema');
const authSchema = require('./schemas/auth.schema');
const chatSchema = require('./schemas/chat.schema');
const tags = require('./tags');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'CineGo-Backend API',
        version: '1.0.0',
    },
    servers: [
        { url: 'http://localhost:4000', description: "Localhost Server" },
        { url: 'https://cinema-app-backend-5ex2.onrender.com', description: "Production Server" }
    ],
    tags,
    paths: {
        ...authPaths.paths,
        ...moviePaths.paths,
        ...cinemaPaths.paths,
        ...hallPaths.paths,
        ...timeSlotPaths.paths,
        ...chatPaths.paths,
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ...authSchema,
            ...movieSchema,
            ...cinemaSchema,
            ...hallSchema,
            ...timeSlotSchema,
            ...chatSchema,
        },
    },
};
