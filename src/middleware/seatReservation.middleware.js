const normalizeSeat = function normalizeSeat() {
    this.seatId = String(this.seatId || '').trim().toUpperCase();
};

module.exports = {
    normalizeSeat
};
