const TimeSlot = require('../models/timeSlot.model');
const Booking = require('../models/booking.model');
const SeatReservation = require('../models/seatReservation.model');

const removeYesterdaySlots = async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const filter = {
        show_date: {
            $gte: yesterdayStart,
            $lt: todayStart
        }
    };

    const deletedSlots = await TimeSlot.find(filter).select('_id');
    if (!deletedSlots.length) {
        return {
            deletedTimeSlots: 0,
            deletedBookings: 0,
            deletedSeatReservations: 0
        };
    }

    const timeSlotIds = deletedSlots.map((slot) => slot._id);

    const [seatReservationResult, bookingResult, timeSlotResult] = await Promise.all([
        SeatReservation.deleteMany({ timeslot: { $in: timeSlotIds } }),
        Booking.deleteMany({ timeslot: { $in: timeSlotIds } }),
        TimeSlot.deleteMany({ _id: { $in: timeSlotIds } })
    ]);

    return {
        deletedTimeSlots: timeSlotResult.deletedCount || 0,
        deletedBookings: bookingResult.deletedCount || 0,
        deletedSeatReservations: seatReservationResult.deletedCount || 0
    };
};

const removeExpiredSlots = async () => {
    await TimeSlot.deleteMany({
        show_date: { $lt: new Date() }
    });
};

module.exports = {
    removeYesterdaySlots,
    removeExpiredSlots
};
