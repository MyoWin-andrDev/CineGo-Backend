const nodemailer = require('nodemailer');

const parseSmtpPort = () => {
    const value = Number(process.env.SMTP_PORT || 587);
    return Number.isNaN(value) ? 587 : value;
};

const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    const port = parseSmtpPort();

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });
};

const sendOtpEmail = async ({ to, otp, expiresInMinutes }) => {
    const from = process.env.SMTP_FROM;
    const transporter = getTransporter();

    if (!to || !otp) {
        throw new Error('Invalid OTP email payload');
    }

    if (!transporter || !from) {
        const message = `OTP email is not configured. Recipient=${to}, OTP=${otp}`;
        if (process.env.NODE_ENV === 'production') {
            throw new Error('SMTP is not configured');
        }
        console.warn(message);
        return;
    }

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
            <h2 style="margin-bottom: 8px;">CineGo Email Verification</h2>
            <p>Your one-time verification code is:</p>
            <p style="font-size: 24px; letter-spacing: 6px; font-weight: bold;">${otp}</p>
            <p>This code expires in ${expiresInMinutes} minutes.</p>
            <p>If you did not request this, you can ignore this email.</p>
        </div>
    `;

    await transporter.sendMail({
        from,
        to,
        subject: 'Your CineGo verification code',
        text: `Your CineGo verification code is ${otp}. This code expires in ${expiresInMinutes} minutes.`,
        html
    });
};

module.exports = {
    sendOtpEmail
};
