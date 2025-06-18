const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  email: { type: String},
  aadhar_number: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  role: { type: String, default: "worker" },

  // Worker-specific
  skillset: { type: String, required: true },
  experience: { type: Number, required: true },
  wages: { type: Number},
  certificate: { type: String, required: true },
  userphoto: { type: String }
});

module.exports = mongoose.model("Worker", workerSchema);