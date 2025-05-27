// routes/register.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Client = require("../models/Registration");
const Worker = require("../models/Worker");
const bcrypt = require("bcrypt");


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
    { name: "userphoto", maxCount: 1 }
]), async (req, res) => {
    try {
        let formData = { ...req.body };
        const hashedPassword = await bcrypt.hash(formData.password, 8);
        //password wiil be stored in User.js schema

        const existing = await Client.findOne({ phone: formData.phone });
        if (existing) {
            return res.json({ success: false, message: "Phone number already exists." });
        }
        delete formData.passwordcheck;
        delete formData.chk_password;
        delete formData.otp;

        if (formData.role === "worker") {
            const newWorker = new Worker({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email || undefined,
                phone: formData.phone,
                birthdate: formData.birthdate,
                aadhar_number: formData.aadhar_number,
                gender: formData.gender,
                age: formData.age,
                address: formData.address,
                state: formData.state,
                city: formData.city,
                region: formData.region,
                role: "worker",
                skillset: formData.skillset,
                experience: formData.experience,
                wages: formData.wages || undefined,
                certificate: req.files["certificate"] ? req.files["certificate"][0].filename : "",
                userphoto: req.files["userphoto"] ? req.files["userphoto"][0].filename : ""
            });
            await newWorker.save();
            console.log("Worker saved to MongoDB");

        } else if (formData.role === "client") {
            delete formData.skillset;
            delete formData.experience;
            delete formData.wages;

            const newClient = new Client({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email || undefined,
                phone: formData.phone,
                birthdate: formData.birthdate,
                aadhar_number: formData.aadhar_number,
                gender: formData.gender,
                age: formData.age,
                address: formData.address,
                state: formData.state,
                city: formData.city,
                region: formData.region,
                role: "client"
            });

            await newClient.save();
            console.log("Client saved to MongoDB");
        }
        console.log("Body: ", formData);
        res.redirect("/auth/login");

    } catch (err) {
        if (err.code === 11000 && err.keyPattern?.phone) {
            res.json({ success: false, message: "Phone number already registered." });
        }
        else if (err.code === 11000 && err.keyPattern?.aadhar_number) {
            res.json({ success: false, message: "Aadhar number already registered." });
        }
        else {
            console.error("Registration error:", err);
            res.json({ success: false, message: "An unexpected error occured!" });
        }
    }
});

module.exports = router;
