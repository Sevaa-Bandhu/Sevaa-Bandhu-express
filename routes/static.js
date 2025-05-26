// routes/static.js
const express = require('express');
const router = express.Router();

// Static pages
router.get('/', (req, res) => res.render('index'));
router.get('/about', (req, res) => res.render('about'));
router.get('/policy', (req, res) => res.render('policy'));
router.get('/help', (req, res) => res.render('help'));
// router.get('/regformworker', (req, res) => res.render('regformworker'));
router.get("/register", (req, res) => res.render("register"));
router.get('/profile', (req, res) => res.render('profile'));
router.get('/termCondition', (req, res) => res.render('termCondition'));

module.exports = router;