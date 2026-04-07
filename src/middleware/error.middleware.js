const notFoundHandler = (req, res) => {
    res.status(404).json({
        con: false,
        msg: 'Route not found'
    });
};

const errorHandler = (err, req, res, next) => {
    console.error("DEBUG ERROR:", err);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        con: false,
        msg: err.message || 'Internal Server Error'
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
