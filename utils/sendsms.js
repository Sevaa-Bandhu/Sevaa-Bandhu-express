const axios = require('axios');
require('dotenv').config();

async function sendSMS(to, message) {
    const options = {
        method: 'POST',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            route: 'q', // q = transactional route
            message: message,
            language: 'english',
            numbers: to // e.g., '919812345678'
        }
    };

    try {
        const response = await axios(options);
        console.log("SMS Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("SMS Send Error:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = sendSMS;
