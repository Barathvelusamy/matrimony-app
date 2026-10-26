const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: { type: String, enum: ["male", "female"], required: true },
    dateOfBirth: { type: Date, required: true },
    height: { type: Number }, // in cm
    maritalStatus: {
      type: String,
      enum: ["never married", "divorced", "widowed"],
      default: "never married",
    },
    religion: { type: String },
    community: { type: String },
    star: { type: String },
    education: { type: String, required: true },
    occupation: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    about: { type: String, maxlength: 500 },
    photo: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);