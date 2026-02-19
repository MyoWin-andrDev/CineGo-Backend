module.exports = {
    User: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '1234567890' },
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
        required: ['name', 'email', 'password'],
        properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
            phone: { type: 'string', example: '1234567890' },
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
