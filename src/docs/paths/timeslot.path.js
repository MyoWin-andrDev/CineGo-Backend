module.exports = {
    paths: {
        '/api/v1/timeslot/{movieId}/cinema/{cinemaId}': {
            get: {
                tags: ['TimeSlots'],
                summary: 'Get time slots by movie and cinema',
                description: 'Returns all available time slots of a movie in a specific cinema',
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'MongoDB Movie ID',
                    },
                    {
                        name: 'cinemaId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'MongoDB Cinema ID',
                    },
                ],
                responses: {
                    200: {
                        description: 'Time slot list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/TimeSlot',
                                    },
                                },
                            },
                        },
                    },
                    404: {
                        description: 'Movie or Cinema not found',
                    },
                },
            },
        },
        '/api/v1/timeslot/{showtimeId}/seats': {
            get: {
                tags: ['TimeSlots'],
                summary: 'Get seat availability by showtime',
                description: 'Returns reserved seats from seat_reservation and a computed seat map for the hall layout.',
                parameters: [
                    {
                        name: 'showtimeId',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'MongoDB Showtime ID',
                    },
                ],
                responses: {
                    200: {
                        description: 'Seat availability',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Seat availability' },
                                        result: {
                                            $ref: '#/components/schemas/SeatAvailabilityResponse',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    404: {
                        description: 'Showtime not found',
                    },
                },
            },
        },
    },
};
