module.exports = {
    ChatRequest: {
        type: 'object',
        required: ['message'],
        properties: {
            message: { type: 'string', example: 'What movies are showing tonight?' },
        },
    },
    ChatResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Here are the movies showing tonight: ...' },
        },
    },
};
