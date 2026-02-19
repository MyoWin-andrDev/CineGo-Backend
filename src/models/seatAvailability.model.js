const mongoose = require('mongoose');

const seatAvailabilitySchema = new mongoose.Schema({
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'time_slot',
        required: true
    },
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seat',
        required: true
    },
    is_available: {
        type: Boolean,
        default: true
    }
});

const seatAvailabilityModel = mongoose.model('seat_availability', seatAvailabilitySchema);

module.exports = seatAvailabilityModel
