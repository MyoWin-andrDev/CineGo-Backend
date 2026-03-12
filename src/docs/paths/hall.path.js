module.exports = {
    paths: {
        '/api/v1/hall': {
            get: {
                tags: ['Halls'],
                summary: 'Get all halls',
                responses: {
                    200: {
                        description: 'Hall list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Hall' },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Halls'],
                summary: 'Create a hall in a cinema',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['cinema'],
                                properties: {
                                    cinema: {
                                        type: 'string',
                                        example: '697c03e8d6258fb85799041a',
                                    },
                                    hallName: {
                                        type: 'string',
                                        example: 'IMAX',
                                    },
                                    seatLayout: {
                                        type: 'object',
                                        properties: {
                                            rowLabels: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                example: ['A', 'B', 'C', 'D', 'E'],
                                            },
                                            seatsPerRow: {
                                                type: 'number',
                                                example: 10,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Hall created',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Hall successfully added to cinema' },
                                        result: { $ref: '#/components/schemas/Hall' },
                                    },
                                },
                            },
                        },
                    },
                    500: { description: 'Server Error' },
                },
            },
        },
    },
};
