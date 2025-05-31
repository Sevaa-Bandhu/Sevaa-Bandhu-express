const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms');
const otpStore = new Map(); // mobile => { otp, expiresAt }

// Constants
const JWT_SECRET = process.env.JWT_SECRET;
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

// Helper: Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ===================== ROUTES =======================

// Render login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { mobile, password } = req.body;
    try {
        const user = await User.findOne({ mobile: req.body.mobile });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found, please register' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

        // Session-based login
        req.session.user = {
            mobile: user.mobile,
            name: `${user.firstname} ${user.lastname}`
        };

        return res.status(200).json({ success: true, redirect: '/auth/dashboard' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;

    if (!/^[0-9]{10}$/.test(mobile)) {
        return res.status(400).json({ success: false, message: 'Invalid mobile number' });
    }

    try {
        const otp = generateOtp();
        const user = await User.findOne({ mobile: req.body.mobile });
        if (user){
        otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
        }
        else{
            return res.status(500).json({ success: false, message: 'Mobile number not found. Please register!' });
        }
        /* await fast2sms.sendMessage({
            authorization: FAST2SMS_API_KEY,
            message: `Your OTP for Sevaa Bandhu password reset is ${otp} (valid 5 minutes).`,
            numbers: [mobile],
            route: 'q'
        }); */

        if (process.env.USE_MOCK_SMS === 'true') {
            console.log(`Mock OTP to ${mobile}: ${otp}`);
        } else {
            await fast2sms.sendMessage({
                authorization: process.env.FAST2SMS_API_KEY,
                message: `Your OTP for Sevaa Bandhu password reset is ${otp} (valid 5 minutes).`,
                numbers: [mobile]
            });
        }

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Send OTP error:', err);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    const record = otpStore.get(mobile);

    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otpStore.delete(mobile);
    return res.status(200).json({ success: true, message: 'OTP verified' });
});

// POST /auth/update-password
router.post('/update-password', async (req, res) => {
    const { mobile, newPassword } = req.body;

    try {
        const user = await User.findOne({ mobile });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        console.error('Update password error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /auth/dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.session.user)
        return res.redirect('/auth/login');

    try {
        const user = await User.findOne({ mobile: req.session.user.mobile }).lean();
        if (!user)
            return res.redirect('/auth/login');

        res.render('dashboard', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard');
    }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
});

module.exports = router;
