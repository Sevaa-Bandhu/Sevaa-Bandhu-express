const express = require('express');
const router = express.Router();
const sendSMS = require('./utils/sendSms');

router.get('/help', (req, res) => res.render('help'));

router.post('/', async (req, res) => {
    const { name, phone, subject, message } = req.body;

    try {
        await sendSMS(`Hello ${name} ( ${phone} )
            Thank you for contacting Sevaa Bandhu! regarding ${subject}. We will follow up soon. Till then explore our website.`);
        res.status(200).send("Message sent successfully!");
    } catch (error) {
        res.status(500).send("Failed to send SMS.");
    }
});

module.exports = router;
