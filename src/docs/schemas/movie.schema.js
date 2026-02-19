module.exports = {
    Movie: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '697b32a47cbd63295511ec01',
            },
            tmdbId: {
                type: 'number',
                example: 1419406,
            },
            title: {
                type: 'string',
                example: "The Shadow's Edge",
            },
            overview: {
                type: 'string',
            },
            posterPath: {
                type: 'string',
            },
            backdropPath: {
                type: 'string',
            },
            rating: {
                type: 'number',
                example: 7.2,
            },
            releaseDate: {
                type: 'string',
                format: 'date-time',
            },
            genres: {
                type: 'array',
                items: { type: 'string' },
            },
            casters: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        profilePath: { type: 'string' },
                    },
                },
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
            },
        },
    },
};
