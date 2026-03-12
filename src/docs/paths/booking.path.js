module.exports = {
    paths: {
        '/api/v1/booking': {
            post: {
                tags: ['Bookings'],
                summary: 'Create booking for a showtime',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['showtimeId', 'seats'],
                                properties: {
                                    showtimeId: {
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
                        description: 'Booking created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Booking created' },
                                        result: { $ref: '#/components/schemas/Booking' }
                                    }
                                }
                            }
                        }
                    },
                    409: {
                        description: 'Seats already taken'
                    }
                }
            }
        }
    }
};
