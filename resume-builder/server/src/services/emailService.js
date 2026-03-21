const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send email
exports.sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw error;
    }
};

// Welcome email template
exports.sendWelcomeEmail = async (email, name) => {
    const html = `
        <h1>Welcome to ResumeForge, ${name}!</h1>
        <p>Thank you for joining us. Start creating your professional resume now.</p>
        <a href="${process.env.CLIENT_URL}/dashboard">Go to Dashboard</a>
    `;

    await this.sendEmail({
        to: email,
        subject: 'Welcome to ResumeForge',
        html
    });
};