let formatMessage = (res, msg , result) => {
    res.status(200).send({
        conn : true,
        msg : msg,
        result: result
    })
}

module.exports = { formatMessage }