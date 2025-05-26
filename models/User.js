const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    mobile: { type: BigInt, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('loguser', userSchema);
