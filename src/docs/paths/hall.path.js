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
        },
    },
};
