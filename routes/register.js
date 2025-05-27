// routes/register.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Client = require("../models/Registration");
const Worker = require("../models/Worker");

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Multer setup for certificate and photo upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.fieldname + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// POST /register
router.post("/register", upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "photo", maxCount: 1 }
]), async (req, res) => {
    try {
        const data = req.body;

        if (data.role === "worker") {
            const newWorker = new Worker({
                firstname: data.firstname,
                lastname: data.lastname,
                gender: data.gender,
                birthdate: data.birthdate,
                age: parseInt(data.age),
                phone: parseInt(data.phone),
                email: data.email,
                aadhar_number: parseInt(data.aadhar_number),
                address: data.address,
                state: data.state,
                city: data.city,
                region: data.region,
                role: "worker",
                skillset: data.skillset,
                experience: parseInt(data.experience),
                certificate: req.files["certificate"] ? req.files["certificate"][0].filename : "",
                photo: req.files["photo"] ? req.files["photo"][0].filename : ""
            });

            await newWorker.save();
        } else {
            const newClient = new Client({
                firstname: data.firstname,
                lastname: data.lastname,
                gender: data.gender,
                birthdate: data.birthdate,
                age: parseInt(data.age),
                phone: parseInt(data.phone),
                email: data.email,
                aadhar_number: parseInt(data.aadhar_number),
                address: data.address,
                state: data.state,
                city: data.city,
                region: data.region,
                role: "client"
            });

            await newClient.save();
        }

        res.redirect("/success");
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Something went wrong.");
    }
});

module.exports = router;
