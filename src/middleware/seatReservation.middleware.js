const normalizeSeat = function normalizeSeat(next) {
    this.seatId = String(this.seatId || '').trim().toUpperCase();
    next();
};

module.exports = {
    normalizeSeat
};
