const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// ✅ Main index page route – initially loads all workers (for client-side pagination)
router.get('/', async (req, res) => {
    const user = req.session.user || null;

    try {
        // Fetch all workers (⚠️ needed for front-end filtering & pagination)
        const workers = await Worker.find();
        res.render('index', { user, workers });  // EJS will paginate on client side
    } catch (err) {
        console.error("Error fetching workers:", err);
        res.render('index', { user, workers: [] });
    }
});

router.get('/aboutUs', (req, res) => res.render('aboutUs'));
router.get('/help', (req, res) => res.render('help'));
router.get('/policy', (req, res) => res.render('policy'));
router.get('/termCondition', (req, res) => res.render('termCondition'));

// ✅ Registration Page
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// ✅ Admin Login Page
router.get('/adminLogin', (req, res) => {
    res.render('admin/adminLogin', { error: null });
});

module.exports = router;
