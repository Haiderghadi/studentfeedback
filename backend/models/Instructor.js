const mongoose = require("mongoose");

// Instructor Schema (matching SQL Instructors table)
const instructorSchema = new mongoose.Schema(
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
    Department: {
      type: String,
      required: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Instructor", instructorSchema);
