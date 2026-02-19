module.exports = {
    paths: {
        '/api/v1/timeslot': {
            get: {
                tags: ['TimeSlots'],
                summary: 'Get all time slots',
                responses: {
                    200: {
                        description: 'Time slot list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/TimeSlot' },
                                },
                            },
                        },
                    },
                },
            },
        },
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
    },
};
