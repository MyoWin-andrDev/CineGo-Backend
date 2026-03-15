const TimeSlot = require('../models/timeSlot.model');
const Booking = require('../models/booking.model');
const SeatReservation = require('../models/seatReservation.model');
const {
    DEFAULT_ROW_LABELS,
    DEFAULT_SEATS_PER_ROW,
    generateSeatIds,
    normalizeSeatId,
    buildSeatMap
} = require('../utils/seat.utils');

const toBadRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const toConflict = (message) => {
    const error = new Error(message);
    error.statusCode = 409;
    return error;
};

const buildTimeSlotFilter = (timeslotId) => ({ timeslot: timeslotId });

const getTimeSlotWithHall = async (timeslotId) => {
    const timeSlot = await TimeSlot.findById(timeslotId).populate({
        path: 'hall',
        populate: { path: 'cinema' }
    });

    if (!timeSlot) {
        const error = new Error('Time slot not found');
        error.statusCode = 404;
        throw error;
    }

    if (!timeSlot.hall) {
        const error = new Error('Hall not found for time slot');
        error.statusCode = 404;
        throw error;
    }

    return timeSlot;
};

const getTimeSlotSeatAvailability = async (timeslotId) => {
    const timeSlot = await getTimeSlotWithHall(timeslotId);
    const hall = timeSlot.hall;
    const rowLabels = hall.seatLayout?.rowLabels?.length
        ? hall.seatLayout.rowLabels
        : DEFAULT_ROW_LABELS;
    const seatsPerRow = hall.seatLayout?.seatsPerRow || DEFAULT_SEATS_PER_ROW;

    const takenSeatDocs = await SeatReservation.find(buildTimeSlotFilter(timeSlot._id)).select('seatId -_id');
    const takenSeats = takenSeatDocs.map((doc) => doc.seatId).sort();

    return {
        timeslotId: timeSlot._id,
        hallId: hall._id,
        cinemaId: hall.cinema?._id || null,
        rows: rowLabels,
        seatsPerRow,
        ticketPrice: timeSlot.base_price,
        takenSeats,
        seatMap: buildSeatMap(takenSeats, rowLabels, seatsPerRow)
    };
};

const createBooking = async ({ timeslotId, seats, userId = null }) => {
    if (!Array.isArray(seats) || seats.length === 0) {
        throw toBadRequest('Please provide at least one seat.');
    }

    if (!timeslotId) {
        throw toBadRequest('Please provide timeslotId.');
    }

    const timeSlot = await getTimeSlotWithHall(timeslotId);
    const hall = timeSlot.hall;
    const rowLabels = hall.seatLayout?.rowLabels?.length
        ? hall.seatLayout.rowLabels
        : DEFAULT_ROW_LABELS;
    const seatsPerRow = hall.seatLayout?.seatsPerRow || DEFAULT_SEATS_PER_ROW;

    const normalizedSeats = seats.map(normalizeSeatId);
    const uniqueSeats = [...new Set(normalizedSeats)];

    if (uniqueSeats.length !== normalizedSeats.length) {
        throw toBadRequest('Duplicate seats in request are not allowed.');
    }

    const validSeatSet = new Set(generateSeatIds(rowLabels, seatsPerRow));
    const invalidSeats = uniqueSeats.filter((seatId) => !validSeatSet.has(seatId));
    if (invalidSeats.length) {
        throw toBadRequest(`Invalid seats for this hall layout: ${invalidSeats.join(', ')}`);
    }

    const seatCount = uniqueSeats.length;
    const ticketPrice = timeSlot.base_price;
    const totalPrice = Number((seatCount * ticketPrice).toFixed(2));

    const booking = await Booking.create({
        timeslot: timeSlot._id,
        hall: hall._id,
        movie: timeSlot.movie,
        cinema: hall.cinema?._id || hall.cinema,
        seats: uniqueSeats,
        seatCount,
        ticketPrice,
        totalPrice,
        user: userId || null
    });

    try {
        await SeatReservation.insertMany(
            uniqueSeats.map((seatId) => ({
                timeslot: timeSlot._id,
                booking: booking._id,
                seatId
            })),
            { ordered: true }
        );
    } catch (error) {
        await Booking.deleteOne({ _id: booking._id });

        if (error?.code === 11000) {
            const takenDocs = await SeatReservation.find({
                ...buildTimeSlotFilter(timeSlot._id),
                seatId: { $in: uniqueSeats }
            }).select('seatId -_id');

            const takenSeats = takenDocs.map((doc) => doc.seatId).sort();
            throw toConflict(`Some seats are already booked: ${takenSeats.join(', ')}`);
        }

        throw error;
    }

    return booking;
};

module.exports = {
    getTimeSlotSeatAvailability,
    createBooking
};
