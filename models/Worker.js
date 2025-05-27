const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  aadhar_number: { type: Number, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  role: { type: String, default: "worker" },

  // Worker-specific
  skillset: { type: String, required: true },
  experience: { type: Number, required: true },
  certificate: { type: String, required: true },
  userphoto: { type: String, required: true }
});

module.exports = mongoose.model("Worker", workerSchema);