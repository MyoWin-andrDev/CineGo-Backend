const mongoose = require('mongoose');
const { DEFAULT_ROW_LABELS, DEFAULT_SEATS_PER_ROW } = require('../utils/seat.utils');
const { updateTotalSeats } = require('../middleware/hall.middleware');

const hallSchema = new mongoose.Schema({
    cinema : {type : mongoose.Schema.Types.ObjectId, ref : 'cinema'},
    hallName : {type : String, default : "IMAX"},
    totalSeats : {type : Number, default : 110},
    seatLayout: {
        rowLabels: {
            type: [String],
            default: DEFAULT_ROW_LABELS
        },
        seatsPerRow: {
            type: Number,
            default: DEFAULT_SEATS_PER_ROW,
            min: 1
        }
    }
}, { timestamps: true });

hallSchema.pre('save', updateTotalSeats);

const hallModel = mongoose.model('hall', hallSchema);

module.exports = hallModel;
