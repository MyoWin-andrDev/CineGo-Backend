const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
    cinema : {type : mongoose.Schema.Types.ObjectId, ref : 'cinema'},
    hallName : {type : String, default : "IMAX"},
    totalSeats : {type : Number, default : 110},
}, { timestamps: true });


const hallModel = mongoose.model('hall', hallSchema);

module.exports = hallModel;
