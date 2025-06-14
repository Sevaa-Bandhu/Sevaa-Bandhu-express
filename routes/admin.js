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

// Dynamic content loading
router.get('/api/workers', async (req, res) => {
    const workers = await Worker.find({});
    res.json(workers);
});

router.get('/api/clients', async (req, res) => {
    const clients = await Client.find({});
    res.json(clients);
});

router.get('/api/admins', async (req, res) => {
    const admins = await Admin.find({});
    res.json(admins);
});

// Load search form dynamically
router.get('/search-form/:role', (req, res) => {
    const { role } = req.params;
    if (!['worker', 'client'].includes(role)) return res.status(400).send('Invalid role');
    return res.render('partials/searchUserForm', { role });
});

// Handle search query
router.get('/search-users', async (req, res) => {
    const { role, q } = req.query;
    if (!q || !['worker', 'client'].includes(role)) {
        return res.send('<p>No results found.</p>');
    }

    const Model = role === 'worker' ? require('../models/Worker') : require('../models/Client');
    const regex = new RegExp(q, 'i');

    const results = await Model.find({
        $or: [
            { firstname: regex },
            { lastname: regex },
            { phone: regex },
            { aadhar_number: regex },
            { city: regex },
            { skillset: regex }  // will be undefined for clients but doesn’t error
        ]
    });

    return res.render('partials/_searchResultsTable', { users: results, role });
});

module.exports = router;