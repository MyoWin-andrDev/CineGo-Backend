const DEFAULT_ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const DEFAULT_SEATS_PER_ROW = 10;

const normalizeSeatId = (seatId) => String(seatId || '').trim().toUpperCase();

const generateSeatIds = (
    rowLabels = DEFAULT_ROW_LABELS,
    seatsPerRow = DEFAULT_SEATS_PER_ROW
) => {
    const ids = [];

    rowLabels.forEach((row) => {
        for (let i = 1; i <= seatsPerRow; i++) {
            ids.push(`${row}${i}`);
        }
    });

    return ids;
};

const buildSeatMap = (takenSeats = [], rowLabels = DEFAULT_ROW_LABELS, seatsPerRow = DEFAULT_SEATS_PER_ROW) => {
    const taken = new Set(takenSeats.map(normalizeSeatId));

    return rowLabels.map((rowLabel) => ({
        row: rowLabel,
        seats: Array.from({ length: seatsPerRow }, (_, index) => {
            const seatNumber = index + 1;
            const seatId = `${rowLabel}${seatNumber}`;
            return {
                seatId,
                seatNumber,
                status: taken.has(seatId) ? 'taken' : 'available'
            };
        })
    }));
};

module.exports = {
    DEFAULT_ROW_LABELS,
    DEFAULT_SEATS_PER_ROW,
    normalizeSeatId,
    generateSeatIds,
    buildSeatMap
};
