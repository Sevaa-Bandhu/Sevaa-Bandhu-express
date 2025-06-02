// routes/register.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Client = require("../models/Client");
const Worker = require("../models/Worker");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

// POST /register
router.post('/register', upload.fields([
    { name: 'userphoto', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
]), async (req, res) => {
    try {
        const role = req.body.choice;
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        //hashed password will be stored in User.js schema

        if (await User.findOne({ phone: req.body.phone })) {
            return res.json({ success: false, message: "Phone number already exists." });
        }
            const newUser = new User({
                mobile: req.body.phone,
                password: hashedPassword,
                firstname: req.body.firstname,
                lastname: req.body.lastname
            });
            await newUser.save();

        if (role === 'worker') {
            const newWorker = new Worker({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                birthdate: req.body.birthdate,
                aadhar_number: req.body.aadhar_number,
                gender: req.body.gender,
                age: parseInt(req.body.age),
                address: req.body.address,
                state: req.body.state,
                city: req.body.city,
                region: req.body.region,
                role: "worker",
                skillset: req.body.skillset,
                experience: parseInt(req.body.experience),
                wages: parseInt(req.body.wages),
                certificate: req.files['certificate'] ? req.files['certificate'][0].path : undefined,
                userphoto: req.files['userphoto'] ? req.files['userphoto'][0].path : undefined
            });
            console.log("New Worker added to MongoDB.");
            await newWorker.save();
            res.json({ success: true, redirect: '/auth/login' });
        }
        if(role === "client"){
            // Handle client registration
                console.log("Unser user routing");

            const newClient = new Client({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                birthdate: req.body.birthdate,
                aadhar_number: req.body.aadhar_number,
                gender: req.body.gender,
                age: parseInt(req.body.age),
                address: req.body.address,
                state: req.body.state,
                city: req.body.city,
                region: req.body.region,
                role: "client",
            });
            console.log("New Client added to MongoDB.");
            await newClient.save();
            res.json({ success: true, redirect: '/auth/login' });
        }
    }
    catch (err) {
        if (err.code === 11000) {
            res.json({ success: false, message: "Phone number or Aadhar number already registered." });
        }
        else {
            console.error("Registration error:", err);
            res.json({ success: false, message: "An unexpected error occured!" });
        }
    }
});

module.exports = router;
