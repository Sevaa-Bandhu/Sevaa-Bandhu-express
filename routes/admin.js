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
    return res.redirect('/admin/login');
}

// =================== AUTH ROUTES =================== //

// GET: Admin Login Page
router.get('/login', (req, res) => {
    res.render('admin/adminLogin', { error: null });
});

// POST: Admin Login
router.post('/login', async (req, res) => {
    const { mobile, password } = req.body;

    if (!/^\d{10}$/.test(mobile)) {
        return res.render('admin/adminLogin', { error: 'Invalid mobile number format' });
    }

    try {
        const admin = await Admin.findOne({ mobile });
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!admin) {
            return res.render('admin/adminLogin', { error: 'Admin not found' });
        }
        else if (!isMatch) {
            return res.render('admin/adminLogin', { error: 'Incorrect password' });
        }

        req.session.admin = {
            name: admin.name,
            mobile: admin.mobile
        };

        return res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        return res.render('admin/adminLogin', { error: 'Login failed' });
    }
});

// GET: Admin Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/admin/login');
    });
});

// =================== DASHBOARD =================== //

router.get('/dashboard', ensureAdmin, async (req, res) => {
    try {
        const totalAdmins = await Admin.countDocuments();
        const totalWorkers = await Worker.countDocuments();
        const totalClients = await Client.countDocuments();
        const workers = await Worker.find();

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

// =================== REGISTRATION =================== //

router.get('/register-form', (req, res) => {
    res.render('partials/adminRegisterForm');
});

// Handle registration
router.post('/register', async (req, res) => {
    const {
        name, password, mobile, email, birthdate,
        aadhar_number, gender, address, city, pincode
    } = req.body;

    try {
        // Check duplicates
        const exists = await Admin.findOne({ $or: [{ mobile }, { email }, { aadhar_number }] });
        if (exists) {
            return res.status(400).json({ success: false, message: "Admin already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save admin
        const admin = new Admin({
            name,
            password: hashedPassword,
            mobile,
            email,
            birthdate,
            aadhar_number,
            gender,
            address,
            city,
            pincode
        });
        await admin.save();
        return res.status(201).json({ success: true, message: "Admin registered successfully." });

    } catch (err) {
        console.error("Admin registration error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

// =================== API ROUTES (with Pagination) =================== //

const paginate = async (Model, page, limit) => {
    const skip = (page - 1) * limit;
    const total = await Model.countDocuments();
    const results = await Model.find().skip(skip).limit(limit);
    return { results, total };
};

// GET /admin/api/workers?page=1
router.get('/api/workers', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const { results, total } = await paginate(Worker, page, limit);
    res.json({ data: results, total });
});

// GET /admin/api/clients?page=1
router.get('/api/clients', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const { results, total } = await paginate(Client, page, limit);
    res.json({ data: results, total });
});

// GET /admin/api/admins?page=1
router.get('/api/admins', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const { results, total } = await paginate(Admin, page, limit);
    res.json({ data: results, total });
});

// =================== SEARCH FUNCTIONALITY =================== //

// Serve search form dynamically
router.get('/search-form/:role', (req, res) => {
    const { role } = req.params;
    if (!['worker', 'client'].includes(role)) {
        return res.status(400).send('Invalid role');
    }
    res.render('partials/searchUserForm', { role });
});

// Handle search logic
router.get('/search-users', async (req, res) => {
    const { role, q } = req.query;
    if (!q || !['worker', 'client'].includes(role)) {
        return res.send('<p>No results found.</p>');
    }

    const Model = role === 'worker' ? Worker : Client;
    const regex = new RegExp(q, 'i');

    const results = await Model.find({
        $or: [
            { firstname: regex },
            { lastname: regex },
            { phone: regex },
            { aadhar_number: regex },
            { city: regex },
            { pincode: regex },
            { address: regex },
            { skillset: regex } // This is ignored for Client
        ]
    });

    res.render('partials/_searchResultsTable', { users: results, role });
});

// =================== EDIT / DELETE FUNCTIONALITY =================== //

// Show Edit Form (empty on load)
router.get('/edit/:role', (req, res) => {
    const { role } = req.params;
    if (!['worker', 'client'].includes(role)) return res.status(400).send('Invalid role');
    res.render('partials/editUserForm', { role, user: null });
});

// GET: Fetch user data for editing
router.get('/edit-fetch', async (req, res) => {
    const { role, keyword } = req.query;
    console.log("Admin.js ", role, keyword);

    if (!role || !keyword || !['worker', 'client'].includes(role)) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const Model = role === 'worker' ? Worker : Client;

    try {
        const user = await Model.findOne({
            $or: [
                { aadhar_number: keyword },
                { phone: keyword }
            ]
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json(user);
    } catch (err) {
        console.error('Fetch Error:', err);
        return res.status(500).json({ message: 'Server Error' });
    }
});

// Update user
router.patch('/update-user', async (req, res) => {
    const { id, role, ...updateData } = req.body;
    if (!id || !role || !['worker', 'client'].includes(role)) {
        return res.status(400).json({ message: 'Missing ID or Role' });
    }

    const Model = role === 'worker' ? Worker : Client;
    try {
        const updated = await Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User updated successfully.' });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: 'Update failed.' });
    }
});

// Delete user
router.delete('/delete-user', async (req, res) => {
    const { id, role } = req.body;
    if (!id || !role || !['worker', 'client'].includes(role)) {
        return res.status(400).json({ message: 'Invalid delete request' });
    }

    const Model = role === 'worker' ? require('../models/Worker') : require('../models/Client');
    try {
        await Model.findByIdAndDelete(id);
        return res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ success: false, message: 'Delete failed' });
    }
});


// =================== VIEW WORKER'S DOCUMENTS FUNCTIONALITY =================== //
router.get('/api/worker-docs', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ message: 'Keyword required' });

    try {
        const worker = await Worker.findOne({
            $or: [
                { phone: keyword },
                { aadhar_number: keyword }
            ]
        });

        if (!worker) return res.status(404).json({ message: 'Worker not found' });

        return res.status(200).json(worker);
    } catch (error) {
        console.error('Worker Docs Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
