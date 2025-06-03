// routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Client = require('../models/Client');
const Worker = require('../models/Worker');

// GET /profile
router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    const mobile = req.session.user.mobile;

    try {
        const user = await User.findOne({ mobile });
        let profile = await Worker.findOne({ phone: mobile });
        let role = 'worker';

        if (!profile) {
            profile = await Client.findOne({ phone: mobile });
            role = 'client';
        }

        if (!profile) {
            return res.status(404).send("Profile not found");
        }

        res.render('profile', { user, profile, role });
    } catch (err) {
        console.error("Error loading profile:", err);
        res.status(500).send("Server error");
    }
});

// POST /profile/update
router.post('/profile/update', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const mobile = req.session.user.mobile;
    const updates = req.body;

    try {
        await User.updateOne({ mobile }, {
            firstname: updates.firstname,
            lastname: updates.lastname
        });

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
        console.error("Profile update failed:", err);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
});

// POST /profile/delete
router.post('/profile/delete', async (req, res) => {
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

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
        console.error("Delete error:", err);
        res.status(500).json({ success: false, message: "Error deleting account" });
    }
});

module.exports = router;
