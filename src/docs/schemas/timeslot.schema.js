module.exports = {
    TimeSlot: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                example: '697c2a48895f133fe51e8cbf',
            },
            movie: {
                type: 'string',
                example: '697b32a47cbd63295511ec01',
                description: 'MongoDB Movie ID',
            },
            hall: {
                oneOf: [
                    { type: 'string', example: '697c03f0d6258fb85799041c' },
                    { $ref: '#/components/schemas/Hall' },
                ],
            },
            show_date: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-30',
            },
            start_time: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-30T10:00:00.000Z',
            },
            end_time: {
                type: 'string',
                format: 'date-time',
                example: '2026-01-30T12:00:00.000Z',
            },
            base_price: {
                type: 'number',
                example: 7.5,
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
