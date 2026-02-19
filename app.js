const express = require('express');

const app = express();
app.use(express.json());

//Router
const cinemaRouter = require('./src/routes/cinema.route');
const movieRouter = require('./src/routes/movie.route');
const timeslotRouter = require('./src/routes/timeslot.route');
const hallRouter = require('./src/routes/hall.route');
const authRouter = require('./src/routes/auth.route');
const chatRouter = require('./src/routes/chat.route');


//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');

app.use('/api/v1/cinema', cinemaRouter);
app.use('/api/v1/movie', movieRouter);
app.use('/api/v1/timeslot', timeslotRouter);
app.use('/api/v1/hall', hallRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
