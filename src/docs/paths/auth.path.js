module.exports = {
    paths: {
        '/api/v1/auth/signup': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SignupRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthSuccess' },
                            },
                        },
                    },
                    400: { description: 'User already exists' },
                    500: { description: 'Server Error' },
                },
            },
        },
        '/api/v1/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login with email and password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthSuccess' },
                            },
                        },
                    },
                    400: { description: 'Invalid Credentials' },
                    500: { description: 'Server Error' },
                },
            },
        },
        '/api/v1/auth/google': {
            post: {
                tags: ['Auth'],
                summary: 'Login with Google',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GoogleLoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Google login successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthSuccess' },
                            },
                        },
                    },
                    400: { description: 'Google login failed' },
                },
            },
        },
        '/api/v1/auth/facebook': {
            post: {
                tags: ['Auth'],
                summary: 'Login with Facebook',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/FacebookLoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Facebook login successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthSuccess' },
                            },
                        },
                    },
                    400: { description: 'Facebook login failed' },
                },
            },
        },
        '/api/v1/auth/github': {
            post: {
                tags: ['Auth'],
                summary: 'Login with GitHub',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GitHubLoginRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'GitHub login successful',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthSuccess' },
                            },
                        },
                    },
                    400: { description: 'GitHub login failed' },
                },
            },
        },
        '/api/v1/auth/update-interests': {
            put: {
                tags: ['Auth'],
                summary: 'Update user preferred genres',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['prefer_genres'],
                                properties: {
                                    prefer_genres: {
                                        type: 'array',
                                        items: { type: 'string' },
                                        example: ['Action', 'Sci-Fi']
                                    }
                                }
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Interests updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Interests updated successfully' },
                                        user: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: 'Unauthorized' },
                    404: { description: 'User not found' },
                    500: { description: 'Server Error' },
                },
            },
        },
        '/api/v1/auth/update-profile': {
            put: {
                tags: ['Auth'],
                summary: 'Update user profile',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'John Doe' },
                                    phone: { type: 'string', example: '0999999999' },
                                    photo: { type: 'string', example: 'https://image.example.com/avatar.jpg' },
                                    dateOfBirth: { type: 'string', format: 'date', example: '2000-01-01' }
                                }
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Profile updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        con: { type: 'boolean', example: true },
                                        msg: { type: 'string', example: 'Profile updated successfully' },
                                        user: { $ref: '#/components/schemas/User' },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: 'Unauthorized' },
                    404: { description: 'User not found' },
                    500: { description: 'Server Error' },
                },
            },
        },
    },
};
