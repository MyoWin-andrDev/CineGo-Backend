module.exports = {
    CreateBookingRequest: {
        type: 'object',
        required: ['timeslotId', 'seats'],
        properties: {
            timeslotId: {
                type: 'string',
                example: '67d04e8458707f2a13f50d66'
            },
            seats: {
                type: 'array',
                items: { type: 'string' },
                example: ['A1', 'A2', 'B1']
            }
        }
    },
    SeatReservation: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '67d0512c66b5c2f5606a5a20'
            },
            timeslot: {
                type: 'string',
                example: '67d04e8458707f2a13f50d66'
            },
            booking: {
                type: 'string',
                example: '67d0512c66b5c2f5606a5a1f'
            },
            seatId: {
                type: 'string',
                example: 'A1'
            },
            createdAt: {
                type: 'string',
                format: 'date-time'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    Booking: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '67d0512c66b5c2f5606a5a1f'
            },
            timeslot: {
                type: 'string',
                example: '67d04e8458707f2a13f50d66'
            },
            hall: {
                type: 'string',
                example: '67d04d9658707f2a13f50d5c'
            },
            movie: {
                type: 'string',
                example: '67d04dfd58707f2a13f50d61'
            },
            cinema: {
                type: 'string',
                example: '67d04d7058707f2a13f50d59'
            },
            seats: {
                type: 'array',
                items: { type: 'string' },
                example: ['A1', 'A2']
            },
            seatCount: {
                type: 'number',
                example: 2
            },
            ticketPrice: {
                type: 'number',
                example: 7.5
            },
            totalPrice: {
                type: 'number',
                example: 15
            },
            status: {
                type: 'string',
                example: 'confirmed'
            },
            createdAt: {
                type: 'string',
                format: 'date-time'
            },
            updatedAt: {
                type: 'string',
                format: 'date-time'
            }
        }
    },
    SeatAvailabilityResponse: {
        type: 'object',
        properties: {
            timeslotId: { type: 'string' },
            hallId: { type: 'string' },
            cinemaId: { type: 'string' },
            rows: {
                type: 'array',
                items: { type: 'string' },
                example: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
            },
            seatsPerRow: {
                type: 'number',
                example: 10
            },
            ticketPrice: {
                type: 'number',
                example: 7.5
            },
            takenSeats: {
                type: 'array',
                items: { type: 'string' },
                example: ['A1', 'A2']
            },
            seatMap: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        row: { type: 'string', example: 'A' },
                        seats: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    seatId: { type: 'string', example: 'A1' },
                                    seatNumber: { type: 'number', example: 1 },
                                    status: { type: 'string', example: 'available' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
