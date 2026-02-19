const TimeSlot = require('../models/timeSlot.model');

const removeExpiredSlots = async () => {
    await TimeSlot.deleteMany({
        show_date: { $lt: new Date() }
    });
};

module.exports = { removeExpiredSlots };
