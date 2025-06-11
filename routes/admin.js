// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Worker = require('../models/Worker');
const Client = require('../models/Client');
const Admin = require('../models/Admin');

// Middleware to protect admin routes
function ensureAdmin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    }
    return res.redirect('admin/login');
}

// POST /admin/login
router.post('/login', async (req, res) => {
    const { mobile, password } = req.body;

    if (!/^\d{10}$/.test(mobile)) {
        return res.render('admin/adminLogin', { error: 'Invalid mobile number format' });
    }

    try {
        const admin = await Admin.findOne({ mobile });
        if (!admin) {
            return res.render('admin/adminLogin', { error: 'Admin not found' });
        }

        // const isMatch = await bcrypt.compare(password, admin.password);
        const isMatch = (password === admin.password);
        if (!isMatch) {
            return res.render('admin/adminLogin', { error: 'Incorrect password' });
        }

        req.session.admin = {
            name: admin.name,
            mobile: admin.mobile
        };
        console.log('Admin session:', req.session.admin);
        return res.redirect('/admin/dashboard');
    } catch (err) {
        return res.render('admin/adminLogin', { error: 'Login failed' });
    }
});

// GET /admin/register (optional - only if you allow admin registration via form)
router.get('/register', (req, res) => {
    res.render('adminRegister', { error: null });
});

// POST /admin/register
router.post('/register', async (req, res) => {
    const { name, mobile, aadhar, gender, dob, email, address, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ mobile });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Mobile already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name, mobile, aadhar, gender, dob, email, address,
            password: hashedPassword
        });

        await newAdmin.save();
        return res.status(201).json({ success: true, message: 'Admin registered successfully.' });
    } catch (err) {
        console.error('Admin registration error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET: Admin Dashboard (Protected)
router.get('/dashboard', async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    try {
        const totalAdmins = await Admin.countDocuments();
        const totalWorkers = await Worker.countDocuments();
        const totalClients = await Client.countDocuments();
        const workers = await Worker.find({});
        const workerCategories = {};

        workers.forEach(worker => {
            const skill = worker.skillset || 'Unspecified';
            workerCategories[skill] = (workerCategories[skill] || 0) + 1;
        });


        res.render('admin/adminDashboard', {
            admin: req.session.admin,
            totalAdmins,
            totalWorkers,
            totalClients,
            workerCategories
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send("Server Error");
    }
});

// GET /admin/logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/admin/adminLogin');
    });
});

module.exports = router;