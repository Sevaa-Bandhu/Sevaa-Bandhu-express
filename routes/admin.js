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

//GET /admin/user-search → used for searching user by aadhar/phone
router.get('/user-search', async (req, res) => {
    const { key } = req.query;

    if (!key) {
        return res.status(400).json({ success: false, message: "No search key provided." });
    }

    try {
        let user = await Worker.findOne({ $or: [{ aadhar_number: key }, { phone: key }] });
        if (user) {
            user.role = 'worker';
        } else {
            user = await Client.findOne({ $or: [{ aadhar_number: key }, { phone: key }] });
            if (user) user.role = 'client';
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Render partial EJS
        res.render('partials/_editUserForm', { user });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ success: false, message: 'Server error during search.' });
    }
});

// POST /admin/update-user → used to update client/worker
router.post('/update-user', async (req, res) => {
    try {
        const { id, firstname, lastname, email, address, city, region, state, age, skill, experience, wages } = req.body;

        let updated;
        updated = await Worker.findById(id);
        if (updated) {
            updated.firstname = firstname;
            updated.lastname = lastname;
            updated.email = email;
            updated.address = address;
            updated.city = city;
            updated.region = region;
            updated.state = state;
            updated.age = age;
            updated.skill = skill;
            updated.experience = experience;
            updated.wages = wages;
            await updated.save();

            return res.json({ success: true, message: "Worker updated successfully." });
        }

        updated = await Client.findById(id);
        if (updated) {
            updated.firstname = firstname;
            updated.lastname = lastname;
            updated.email = email;
            updated.address = address;
            updated.city = city;
            updated.region = region;
            updated.state = state;
            updated.age = age;
            await updated.save();

            return res.json({ success: true, message: "Client updated successfully." });
        }

        return res.status(404).json({ success: false, message: "User not found." });
    } catch (err) {
        console.error("Update user error:", err);
        return res.status(500).json({ success: false, message: "Server error during update." });
    }
});

// DELETE /admin/delete-user/:id → used to delete the user
router.delete('/delete-user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let deleted = await Worker.findByIdAndDelete(id);
        if (deleted) {
            return res.json({ success: true, message: "Worker deleted successfully." });
        }

        deleted = await Client.findByIdAndDelete(id);
        if (deleted) {
            return res.json({ success: true, message: "Client deleted successfully." });
        }

        res.status(404).json({ success: false, message: "User not found." });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ success: false, message: "Server error during deletion." });
    }
});

module.exports = router;