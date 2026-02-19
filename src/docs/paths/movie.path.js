module.exports = {
    paths: {
        '/api/v1/movie': {
            get: {
                tags: ['Movies'],
                summary: 'Get now playing movies',
                responses: {
                    200: {
                        description: 'Movie list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Movie' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/movie/sync': {
            get: {
                tags: ['Movies'],
                summary: 'Automatically Sync by Uptimer Robot',
                responses: {
                    200: {
                        description: 'Movie list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Movie' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/v1/movie/{movieId}/cinema': {
            get: {
                tags: ['Movies'],
                summary: 'Get Cinema by movieId',
                parameters: [
                    {
                        name: 'movieId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Cinema detail',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Cinema' },
                            },
                        },
                    },
                    404: {
                        description: 'Cinema not found',
                    },
                },
            },
        },
    },
};
