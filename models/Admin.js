// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String,required: true},
    mobile: {type: String,required: true,unique: true},
    email: {type: String, required: true, unique: true},
    birthdate: {type: String,required: true},
    aadhar_number: {type: String,required: true,unique: true},
    gender: {type: String,required: true},
    address: {type: String,required: true},
    city: {type: String,required: true},
    pincode: {type: String,required: true}
});

module.exports = mongoose.model('Admin', adminSchema);
