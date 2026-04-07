require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');
require('./src/node_corn/schedular');
const { errorHandler, notFoundHandler } = require('./src/middleware/error.middleware');

connectDB();

const PORT = process.env.PORT;

//API Health Point (Breaking cold start)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use(notFoundHandler);
app.use(errorHandler);

process.on('unhandledRejection', (error) => {
    
});

process.on('uncaughtException', (error) => {
    
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
