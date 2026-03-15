const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    timeslot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timeslot',
        required: true,
        index: true
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hall',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinema',
        required: true
    },
    seats: {
        type: [String],
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    }
}, {timestamps: true});

const bookingModel = mongoose.model('booking', bookingSchema);

module.exports = bookingModel;
