module.exports = {
    CinemaCreateRequest: {
        type: 'object',
        required: ['name', 'location'],
        properties: {
            name: {
                type: 'string',
                example: 'Junction City Cinema',
            },
            address: {
                type: 'string',
                example: 'Bogyoke Aung San Rd, Yangon',
            },
            city: {
                type: 'string',
                example: 'Yangon',
            },
            location: {
                type: 'object',
                required: ['coordinates'],
                properties: {
                    type: {
                        type: 'string',
                        example: 'Point',
                        default: 'Point',
                    },
                    coordinates: {
                        type: 'array',
                        items: { type: 'number' },
                        minItems: 2,
                        maxItems: 2,
                        example: [96.1951, 16.8661],
                        description: '[longitude, latitude]',
                    },
                },
            },
        },
    },
    Cinema: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '697c03e8d6258fb85799041a',
            },
            name: {
                type: 'string',
                example: 'Junction City Cinema',
            },
            address: {
                type: 'string',
                example: 'Bogyoke Aung San Rd, Yangon',
            },
            city: {
                type: 'string',
                example: 'Yangon',
            },
            location: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        example: 'Point',
                    },
                    coordinates: {
                        type: 'array',
                        items: { type: 'number' },
                        example: [96.1951, 16.8661],
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
