module.exports = {
    paths: {
        '/api/v1/cinema': {
            get: {
                tags: ['Cinemas'],
                summary: 'Get all cinemas',
                responses: {
                    200: {
                        description: 'List of cinemas',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Cinema' },
                                },
                            },
                        },
                    },
                },
            },
        },

        '/api/v1/cinema/create': {
            post: {
                tags: ['Cinemas'],
                summary: 'Create a cinema (auto-create IMAX hall)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CinemaCreateRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Cinema created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Cinema',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
