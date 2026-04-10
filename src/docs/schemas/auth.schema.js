module.exports = {
    User: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '1234567890' },
            isEmailVerified: { type: 'boolean', example: true },
            googleId: { type: 'string', example: '112233445566778899' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    AuthSuccess: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'Login successful' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
        },
    },
    SignupRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
            phone: { type: 'string', example: '1234567890' },
        },
    },
    SignupOtpSentResponse: {
        type: 'object',
        properties: {
            con: { type: 'boolean', example: true },
            msg: { type: 'string', example: 'OTP sent to your email' },
            data: {
                type: 'object',
                properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    expiresInSec: { type: 'number', example: 300 },
                    resendAfterSec: { type: 'number', example: 60 },
                }
            }
        }
    },
    VerifyEmailOtpRequest: {
        type: 'object',
        required: ['email', 'otp'],
        properties: {
            email: { type: 'string', example: 'john@example.com' },
            otp: { type: 'string', example: '123456' },
        },
    },
    ResendEmailOtpRequest: {
        type: 'object',
        required: ['email'],
        properties: {
            email: { type: 'string', example: 'john@example.com' },
        },
    },
    UpdateInterestsRequest: {
        type: 'object',
        required: ['prefer_genres'],
        properties: {
            prefer_genres: {
                type: 'array',
                items: { type: 'string' },
                example: ['Action', 'Sci-Fi']
            }
        },
    },
    UpdateProfileRequest: {
        type: 'object',
        properties: {
            name: { type: 'string', example: 'John Doe' },
            phone: { type: 'string', example: '0999999999' },
            photo: { type: 'string', example: 'https://image.example.com/avatar.jpg' },
            dateOfBirth: { type: 'string', format: 'date', example: '2000-01-01' }
        },
    },
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
        },
    },
    GoogleLoginRequest: {
        type: 'object',
        required: ['token'],
        properties: {
            token: { type: 'string', description: 'Google ID Token', example: 'eyJhbGciOiJSUzI1NiIsImtpZ...' },
        },
    },
    FacebookLoginRequest: {
        type: 'object',
        required: ['accessToken', 'userID'],
        properties: {
            accessToken: { type: 'string', description: 'Facebook Access Token', example: 'EAA...' },
            userID: { type: 'string', description: 'Facebook User ID', example: '1234567890' },
        },
    },
    GitHubLoginRequest: {
        type: 'object',
        required: ['code'],
        properties: {
            code: { type: 'string', description: 'GitHub OAuth Code', example: 'a1b2c3d4e5f6...' },
        },
    },
};
