module.exports = {
    paths: {
        '/api/v1/auth/signup': {
            post: {
                tags: ['Auth'],
                summary: 'Register user and send OTP email',
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
                        description: 'OTP sent successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SignupOtpSentResponse' },
                            },
                        },
                    },
                    400: { description: 'Invalid request' },
                    409: { description: 'User already exists and is verified' },
                    429: { description: 'Too many OTP requests' },
                    500: { description: 'Failed to send OTP' },
                },
            },
        },
        '/api/v1/auth/verify-email-otp': {
            post: {
                tags: ['Auth'],
                summary: 'Verify email OTP and activate account',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/VerifyEmailOtpRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Email verified successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthSuccess' },
                            },
                        },
                    },
                    400: { description: 'Invalid or expired OTP' },
                    404: { description: 'User not found' },
                    409: { description: 'Email already verified' },
                    429: { description: 'Too many failed attempts' },
                    500: { description: 'Server Error' },
                },
            },
        },
        '/api/v1/auth/resend-email-otp': {
            post: {
                tags: ['Auth'],
                summary: 'Resend OTP to unverified email',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ResendEmailOtpRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'OTP resent successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/SignupOtpSentResponse' },
                            },
                        },
                    },
                    400: { description: 'Invalid request' },
                    404: { description: 'User not found' },
                    409: { description: 'Email already verified' },
                    429: { description: 'Too many OTP requests' },
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
                    403: { description: 'Email not verified' },
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
                            schema: { $ref: '#/components/schemas/UpdateInterestsRequest' },
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
                            schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
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
