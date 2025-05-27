const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Show login form
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Handle login logic
router.post('/login', async (req, res) => {
    const { mobile, password } = req.body;

    try {
        if (!mobile || !password) {
            return res.render('login', { error: 'All fields are required.' });
        }

        const user = await User.findOne({ mobile });
        if (!user || user.password !== password) {
            return res.render('login', { error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('login', { error: 'Invalid credentials.' });
        }

        // Set session
        if (user) {
            req.session.user = user.mobile;
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    }
    catch (err) {
        console.error(err);
        res.render('login', { error: 'Server error. Try again.' });
    }
});

// Protected dashboard route
router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.user.mobile).lean();
        if (!user) return res.redirect('/login');

        res.render('dashboard', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard');
    }
});

//logout functionality
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});


// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
    });
    res.redirect('/auth/login');
});

module.exports = router;