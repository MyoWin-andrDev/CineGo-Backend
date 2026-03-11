const formatMessage = (res, msg, result, statusCode = 200) => {
    res.status(statusCode).json({
        con: true,
        conn: true,
        msg,
        result
    });
};

module.exports = { formatMessage };
