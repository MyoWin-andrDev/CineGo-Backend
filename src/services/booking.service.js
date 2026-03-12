const TimeSlot = require('../models/timeSlot.model');
const Hall = require('../models/hall.model');
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

const getShowtimeWithHall = async (showtimeId) => {
    const showtime = await TimeSlot.findById(showtimeId).populate({
        path: 'hall',
        populate: { path: 'cinema' }
    });

    if (!showtime) {
        const error = new Error('Showtime not found');
        error.statusCode = 404;
        throw error;
    }

    if (!showtime.hall) {
        const error = new Error('Hall not found for showtime');
        error.statusCode = 404;
        throw error;
    }

    return showtime;
};

const getShowtimeSeatAvailability = async (showtimeId) => {
    const showtime = await getShowtimeWithHall(showtimeId);
    const hall = showtime.hall;
    const rowLabels = hall.seatLayout?.rowLabels?.length
        ? hall.seatLayout.rowLabels
        : DEFAULT_ROW_LABELS;
    const seatsPerRow = hall.seatLayout?.seatsPerRow || DEFAULT_SEATS_PER_ROW;

    const takenSeatDocs = await SeatReservation.find({ showtime: showtime._id }).select('seatId -_id');
    const takenSeats = takenSeatDocs.map((doc) => doc.seatId).sort();

    return {
        showtimeId: showtime._id,
        hallId: hall._id,
        cinemaId: hall.cinema?._id || null,
        rows: rowLabels,
        seatsPerRow,
        ticketPrice: showtime.base_price,
        takenSeats,
        seatMap: buildSeatMap(takenSeats, rowLabels, seatsPerRow)
    };
};

const createBooking = async ({ showtimeId, seats, userId = null }) => {
    if (!Array.isArray(seats) || seats.length === 0) {
        throw toBadRequest('Please provide at least one seat.');
    }

    const showtime = await getShowtimeWithHall(showtimeId);
    const hall = showtime.hall;
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
    const ticketPrice = showtime.base_price;
    const totalPrice = Number((seatCount * ticketPrice).toFixed(2));

    const booking = await Booking.create({
        showtime: showtime._id,
        hall: hall._id,
        movie: showtime.movie,
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
                showtime: showtime._id,
                booking: booking._id,
                seatId
            })),
            { ordered: true }
        );
    } catch (error) {
        await Booking.deleteOne({ _id: booking._id });

        if (error?.code === 11000) {
            const takenDocs = await SeatReservation.find({
                showtime: showtime._id,
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
    getShowtimeSeatAvailability,
    createBooking
};
