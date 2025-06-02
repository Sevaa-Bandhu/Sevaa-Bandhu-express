// routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Client = require('../models/Client');
const Worker = require('../models/Worker');

// GET /profile
router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');

    try {
        const mobile = req.session.user.mobile;
        const user = await User.findOne({ mobile }).lean();
        const client = await Client.findOne({ phone: mobile }).lean();
        const worker = await Worker.findOne({ phone: mobile }).lean();

        const profile = worker || client;
        const role = profile?.role || 'client';

        console.log('Rendering profile with:', profile);
        res.render('profile', { user, profile, role });
    } catch (err) {
        console.error("Profile load error:", err);
        res.status(500).send("Error loading profile");
    }
});

// POST /profile/update
router.post('/update', async (req, res) => {
    if (!req.session.user) return res.status(403).json({ success: false, message: "Unauthorized" });

    try {
        const mobile = req.session.user.mobile;
        const updates = req.body;

        // Update User model
        await User.updateOne({ mobile }, {
            firstname: updates.firstname,
            lastname: updates.lastname
        });

        // Update Client or Worker
        const client = await Client.findOne({ phone: mobile });
        const worker = await Worker.findOne({ phone: mobile });

        if (client) {
            await Client.updateOne({ phone: mobile }, {
                firstname: updates.firstname,
                lastname: updates.lastname,
                email: updates.email,
                gender: updates.gender,
                address: updates.address,
                city: updates.city,
                region: updates.region,
                state: updates.state
            });
        } else if (worker) {
            await Worker.updateOne({ phone: mobile }, {
                firstname: updates.firstname,
                lastname: updates.lastname,
                email: updates.email,
                gender: updates.gender,
                address: updates.address,
                city: updates.city,
                region: updates.region,
                state: updates.state,
                skillset: updates.skillset,
                experience: updates.experience,
                wages: updates.wages
            });
        }

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
});

// POST /profile/delete
router.post('/delete', async (req, res) => {
    if (!req.session.user) return res.status(403).json({ success: false, message: "Unauthorized" });

    try {
        const mobile = req.session.user.mobile;

        await User.deleteOne({ mobile });
        await Client.deleteOne({ phone: mobile });
        await Worker.deleteOne({ phone: mobile });

        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ success: true });
        });
    } catch (err) {
        console.error("Account deletion error:", err);
        res.status(500).json({ success: false, message: "Error deleting account" });
    }
});

module.exports = router;
