const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fname: String,
    lname: String
});

module.exports = mongoose.model('User', userSchema);
