// routes/help.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!email || !name || !subject || !message) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const ownerMail = {
            from: process.env.EMAIL_USER,
            to: process.env.OWNER_EMAIL,
            subject: 'New Help Request from Website',
            html: `
                <h2>You received a new help request</h2>
                <p><b>User Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Subject:</b> ${subject}</p>
                <p><b>Message:</b> ${message}</p>`,
            };

        const userMail = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `We received your request ${name}`,
            html: `
    <p>Dear ${name},</p>
    <p>Thank you for reaching out to Sevaa Bandhu. We’ve received your message and will respond shortly.</p>
    <br/>
    <p>Explore our other features on website and feel free to reach us for other querries anytime.</p>
    <p>Warm regards,<br>Sevaa Bandhu Team</p>`,
        };

        await transporter.sendMail(ownerMail);
        await transporter.sendMail(userMail);

        res.status(200).json({ message: 'Emails sent successfully.' });
    } catch (err) {
        console.error('Error sending emails:', err);
        res.status(500).json({ error: 'Failed to send emails' });
    }
});

module.exports = router;
