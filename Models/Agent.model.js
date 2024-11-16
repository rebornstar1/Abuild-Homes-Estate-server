const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  RERANumber: {
    type: String,
    required: true,
    unique: true,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  specialization: {
    type: [String],
    required: true,
  },
  licensesAndCertifications: {
    type: [String],
    required: false,
  },
  IDProof: {
    type: String,
    required: true,
  },
  addressProof: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["Agent", "Admin", "SuperAdmin"],
    default: "Agent",
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Agent", AgentSchema);
