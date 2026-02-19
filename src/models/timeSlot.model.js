const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hall',
        required: true
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    show_date: { type: Date, required: true },
    base_price: { type: Number, required: true }
}, { timestamps: true });

// prevent duplicates
timeSlotSchema.index(
    { movie: 1, hall : 1, show_date: 1, start_time: 1 },
    { unique: true }
);

const timeSlotModel = mongoose.model('timeslot', timeSlotSchema);

module.exports = timeSlotModel;
