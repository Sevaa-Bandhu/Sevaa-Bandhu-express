const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String,required: true},
    email: {type: String},
    phone: {type: String,required: true,unique: true},
    birthdate: {type: String,required: true},
    aadhar_number: {type: String,required: true,unique: true},
    gender: {type: String,required: true},
    age: {type: Number, required: true},
    address: {type: String,required: true},
    state: {type: String,required: true},
    city: {type: String,required: true},
    region: {type: String,required: true},
    role: {type: String,required: true}
});
module.exports = mongoose.model("Client", clientSchema);
