const express = require('express');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// GET Help Page
router.get('/help', (req, res) => {
  res.render('help', { success: null }); // or false
});

// POST Help Page (SMS sending)
router.post('/help', async (req, res) => {
    const { name, phone, subject, message } = req.body;
    const smsMessage = `Hello ${ name }, thank you for contacting us regarding ${ subject }.We will follow up soon.`;

    // Validate the phone number
    if (!/^\d{10}$/.test(phone)) {
    return res.render('help', { success: false, error: 'Invalid phone number' });
    }

    try {
        await client.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE,
            to: `+91${phone}`
        });
    res.render('help', { success: true, error: null });
    }catch (error) {
        console.error(error);
        res.render('help', { success: false, error: 'Failed to send SMS. Please try again.' });
    }
});

module.exports = router;