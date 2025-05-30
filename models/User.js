const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: String,
    lastname: String
});

module.exports = mongoose.model('User', userSchema);
