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

// GET /admin/edit-user-form (renders the blank form with search input only)
router.get('/edit-user-form', (req, res) => {
    res.render('partials/_editUserForm'); // This partial only shows search bar (no user prefilled yet)
});

// Get /admin/search-user fetches and displays result
router.get('/search-user', async (req, res) => {
    const { key } = req.query;
    const user = await Worker.findOne({ $or: [{ phone: key }, { aadhar_number: key }] }) ||
        await Client.findOne({ $or: [{ phone: key }, { aadhar_number: key }] });

    if (!user)
        return res.send("<p>No user found.</p>");
    res.render('partials/_editUserForm', { user }); // the actual prefilled form
});

// GET: Edit User by Phone or Aadhar
router.get('/edit-user', ensureAdmin, async (req, res) => {
    const { key } = req.query;
    if (!key) return res.status(400).send('Missing query key.');

    try {
        let user = await Worker.findOne({ $or: [{ phone: key }, { aadhar_number: key }] });
        if (!user) {
            user = await Client.findOne({ $or: [{ phone: key }, { aadhar_number: key }] });
        }

        if (!user) return res.status(404).send('<p style="color:red;">User not found.</p>');

        res.render('admin/partials/_editUserForm', { user });
    } catch (err) {
        console.error('Edit-user fetch error:', err);
        res.status(500).send('Server error while fetching user.');
    }
});

// POST: Update User
router.post('/update-user', ensureAdmin, async (req, res) => {
    const {
        id, firstname, lastname, gender, birthdate, age,
        phone, aadhar_number, email, city, state, pincode,
        address, role, skillset, experience, wages
    } = req.body;

    try {
        await User.updateOne({ mobile: phone }, { firstname, lastname });

        if (role === 'worker') {
            await Worker.updateOne({ _id: id }, {
                firstname, lastname, gender, birthdate, age, phone,
                aadhar_number, email, city, state, pincode, address,
                skillset, experience, wages
            });
        } else if (role === 'client') {
            await Client.updateOne({ _id: id }, {
                firstname, lastname, gender, birthdate, age, phone,
                aadhar_number, email, city, state, pincode, address
            });
        }

        res.json({ success: true, message: 'User updated successfully.' });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
});

// DELETE: Delete User
router.delete('/delete-user/:id', ensureAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const worker = await Worker.findById(id);
        const client = await Client.findById(id);

        if (!worker && !client) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (worker) {
            await Worker.deleteOne({ _id: id });
            await User.deleteOne({ mobile: worker.phone });
        }

        if (client) {
            await Client.deleteOne({ _id: id });
            await User.deleteOne({ mobile: client.phone });
        }

        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ success: false, message: 'Error deleting user.' });
    }
});

module.exports = router;