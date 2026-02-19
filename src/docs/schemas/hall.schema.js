module.exports = {
    Hall: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '697c03f0d6258fb85799041c',
            },
            cinema: {
                type: 'string',
                example: '697c03e8d6258fb85799041a',
                description: 'Cinema ID this hall belongs to',
            },
            hallName: {
                type: 'string',
                example: 'IMAX',
            },
            totalSeats: {
                type: 'number',
                example: 110,
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-30T01:05:52.853Z',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-30T01:05:52.853Z',
            },
        },
    },
};
