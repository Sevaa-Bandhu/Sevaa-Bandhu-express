const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Make sure Admin model exists
const bcrypt = require('bcrypt');

// GET - Show admin login form
router.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});

// POST - Handle admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.render('admin/login', { error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/login', { error: 'Incorrect password' });
        }

        req.session.admin = {
            _id: admin._id,
            name: admin.name,
            email: admin.email
        };

        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).render('admin/login', { error: 'Server error' });
    }
});

// GET - Admin dashboard placeholder
router.get('/dashboard', (req, res) => {
    if (!req.session.admin) return res.redirect('/admin/login');
    res.render('admin/dashboard', { admin: req.session.admin });
});

// GET - Admin logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/admin/login');
    });
});

module.exports = router;
