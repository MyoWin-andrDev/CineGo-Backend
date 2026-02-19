const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinema',
        required: true
    },
    seat_no: { type: Number, required: true },
    seat_type: {
        type: String,
        enum: ['regular', 'vip', 'couple']
    }
});

const seatModel = mongoose.model('seat', seatSchema);

module.exports = seatModel;
