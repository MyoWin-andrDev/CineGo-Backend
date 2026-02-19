require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');

connectDB();

const PORT = process.env.PORT;

//API Health Point (Breaking cold start)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use((err, req, res,next) => {
    err.status = err.status || 404;
    res.status(err.status).send({con : false, msg : err.message});
})

app.use((req, res) => {
    res.status(404).send({ con: false, msg: "Not Route Found" });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
