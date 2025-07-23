const mongoose = require("mongoose");

// Course Schema (matching SQL Courses table)
const courseSchema = new mongoose.Schema(
  {
    Id: {
      type: Number,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    InstructorId: {
      type: Number,
      required: true,
      ref: "Instructor",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
