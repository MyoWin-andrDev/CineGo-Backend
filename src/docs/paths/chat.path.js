module.exports = {
    paths: {
        '/api/v1/chat': {
            post: {
                tags: ['Chat'],
                summary: 'Chat with AI Assistant',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChatRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'AI response',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ChatResponse' },
                            },
                        },
                    },
                    401: { description: 'Unauthorized' },
                    500: { description: 'Server Error' },
                },
            },
        },
    },
};
