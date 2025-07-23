const mongoose = require("mongoose");

// Enrollment Schema (matching SQL Enrollments table)
const enrollmentSchema = new mongoose.Schema(
  {
    Id: {
      type: Number,
      required: true,
      unique: true,
    },
    StudentId: {
      type: Number,
      required: true,
      ref: "Student",
    },
    CourseId: {
      type: Number,
      required: true,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique enrollment (matching SQL constraint)
enrollmentSchema.index({ StudentId: 1, CourseId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
