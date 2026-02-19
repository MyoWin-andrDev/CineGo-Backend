const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    city: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
}, { timestamps: true });

cinemaSchema.index({ location: '2dsphere' });

const cinemaModel = mongoose.model('cinema', cinemaSchema);

module.exports = cinemaModel;
