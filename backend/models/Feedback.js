const mongoose = require("mongoose");

// Feedback Schema (matching SQL Feedback table)
const feedbackSchema = new mongoose.Schema(
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
    Rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    Comment: {
      type: String,
      default: "",
    },
    CreatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Using CreatedAt instead
  }
);

// Compound index to ensure one feedback per student per course (matching SQL constraint)
feedbackSchema.index({ StudentId: 1, CourseId: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
