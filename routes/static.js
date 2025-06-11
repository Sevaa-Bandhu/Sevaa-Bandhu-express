// routes/static.js
const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// Index page routing
router.get('/', async (req, res) => {
    const user = req.session.user || null;

    try {
        // Fetch top N workers (e.g., latest 6)
        const workers = await Worker.find().limit(10);
        res.render('index', { user, workers }); // ⬅️ Pass workers to EJS
    } catch (err) {
        console.error("Error fetching workers:", err);
        res.render('index', { user, workers: [] });
    }
});

// Other page routing
router.get('/aboutUs', (req, res) => res.render('aboutUs'));
router.get('/help', (req, res) => res.render('help'));
router.get('/policy', (req, res) => res.render('policy'));
router.get("/register", (req, res) => res.render("register"));
router.get('/termCondition', (req, res) => res.render('termCondition'));
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});
// GET /admin/login
router.get('/adminLogin', (req, res) => {
    res.render('admin/adminLogin', { error: null });
});

module.exports = router;