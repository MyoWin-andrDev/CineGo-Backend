module.exports = {
    paths: {
        '/api/v1/booking': {
            post: {
                tags: ['Bookings'],
                summary: 'Create booking and reserve seats for a time slot',
                description: 'Creates a booking record and corresponding seat_reservation records atomically.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
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
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Booking created and seats reserved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        conn: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Booking created' },
                                        result: { $ref: '#/components/schemas/Booking' }
                                    }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Invalid request (e.g., empty seats, duplicate seats, invalid seat IDs)'
                    },
                    404: {
                        description: 'Time slot or hall not found'
                    },
                    409: {
                        description: 'Seats already taken'
                    },
                    500: {
                        description: 'Server Error'
                    }
                }
            }
        }
    }
};
