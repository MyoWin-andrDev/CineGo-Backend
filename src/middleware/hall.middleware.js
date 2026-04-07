const { DEFAULT_ROW_LABELS, DEFAULT_SEATS_PER_ROW } = require('../utils/seat.utils');

const updateTotalSeats = function updateTotalSeats() {
    const normalizedRows = (this.seatLayout?.rowLabels || DEFAULT_ROW_LABELS)
        .map((row) => String(row).trim().toUpperCase())
        .filter(Boolean);
    const uniqueRows = [...new Set(normalizedRows)];

    this.seatLayout = this.seatLayout || {};
    this.seatLayout.rowLabels = uniqueRows.length ? uniqueRows : DEFAULT_ROW_LABELS;
    this.seatLayout.seatsPerRow = this.seatLayout.seatsPerRow || DEFAULT_SEATS_PER_ROW;

    const rowCount = this.seatLayout.rowLabels.length;
    const seatsPerRow = this.seatLayout?.seatsPerRow || DEFAULT_SEATS_PER_ROW;
    this.totalSeats = rowCount * seatsPerRow;
};

module.exports = {
    updateTotalSeats
};
