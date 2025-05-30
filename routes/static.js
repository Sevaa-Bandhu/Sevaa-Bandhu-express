// routes/static.js
const express = require('express');
const router = express.Router();

// Static pages
router.get('/', (req, res) => {
    const user = req.session.user || null;
    res.render('index', { user: req.session.user });
});
router.get('/aboutUs', (req, res) => res.render('aboutUs'));
router.get('/help', (req, res) => res.render('help'));
router.get('/policy', (req, res) => res.render('policy'));
router.get("/register", (req, res) => res.render("register"));
router.get('/profile', (req, res) => res.render('profile'));
router.get('/termCondition', (req, res) => res.render('termCondition'));
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

module.exports = router;