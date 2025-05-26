const express = require('express');
const router = express.Router();
const User = require('../models/User');
//const Worker = require('../models/Worker');
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

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Register logic
router.post('/register', async (req, res) => {
    const { mobile, password, confirmPassword } = req.body;

    if (!mobile || !password || !confirmPassword) {
        return res.render('register', { error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.render('register', { error: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
        return res.render('register', { error: 'Mobile number already exists.' });
    }

    // hash in production
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new User({ mobile, password: hashedPassword });
    await newuser.save();

    req.session.user = newuser;
    res.redirect('/login');
});

// Worker Registration Page
router.get('/register-worker', (req, res) => {
    res.render('regformworker', { error: null });
});
/*
// Worker Registration Logic
router.post('/register-worker', async (req, res) => {
    const { name, phone, skills } = req.body;

    if (!name || !phone || !skills) {
        return res.render('regformworker', { error: 'All fields are required.' });
    }

    const worker = new Worker({ name, phone, skills });
    await worker.save();

    res.redirect('/');
});
*/

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
    });
    res.redirect('/auth/login');
});

module.exports = router;