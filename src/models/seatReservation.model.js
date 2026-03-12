const mongoose = require('mongoose');
const { normalizeSeat } = require('../middleware/seatReservation.middleware');

const seatReservationSchema = new mongoose.Schema({
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timeslot',
        required: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking',
        required: true
    },
    seatId: {
        type: String,
        required: true
    }
}, { timestamps: true });

seatReservationSchema.pre('save', normalizeSeat);

seatReservationSchema.index({ showtime: 1, seatId: 1 }, { unique: true });
seatReservationSchema.index({ booking: 1 });

const seatReservationModel = mongoose.model('seat_reservation', seatReservationSchema);

module.exports = seatReservationModel;
