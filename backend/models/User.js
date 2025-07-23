const mongoose = require("mongoose");

// Student Schema (matching SQL Students table)
const studentSchema = new mongoose.Schema(
  {
    Id: {
      type: Number,
      required: true,
      unique: true,
    },
    FullName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    // For authentication simulation
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
