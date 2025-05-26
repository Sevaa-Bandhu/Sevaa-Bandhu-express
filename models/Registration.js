const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    aadhar_number: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true
    },
    firstname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    region: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Registration", registrationSchema);
