const express = require("express");
const Feedback = require("../models/Feedback");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Submit feedback (Student only)
router.post("/submit", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const { courseId, rating, comment } = req.body;

    // Validation
    if (!courseId || !rating) {
      return res
        .status(400)
        .json({ message: "Course ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const parsedCourseId = parseInt(courseId);

    // Check if course exists
    const course = await Course.findOne({ Id: parsedCourseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      StudentId: req.user.userId,
      CourseId: parsedCourseId,
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      CourseId: parsedCourseId,
      StudentId: req.user.userId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message: "You have already submitted feedback for this course",
      });
    }

    // Get next Id for feedback
    const lastFeedback = await Feedback.findOne().sort({ Id: -1 });
    const nextId = lastFeedback ? lastFeedback.Id + 1 : 1;

    // Create new feedback
    const feedback = new Feedback({
      Id: nextId,
      CourseId: parsedCourseId,
      StudentId: req.user.userId,
      Rating: parseInt(rating),
      Comment: comment || "",
      CreatedAt: new Date(),
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: {
        Id: feedback.Id,
        CourseId: feedback.CourseId,
        Rating: feedback.Rating,
        Comment: feedback.Comment,
        CreatedAt: feedback.CreatedAt,
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already submitted feedback for this course",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Get student's submitted feedback
router.get("/my-feedback", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const feedback = await Feedback.aggregate([
      {
        $match: { StudentId: req.user.userId },
      },
      {
        $lookup: {
          from: "courses",
          localField: "CourseId",
          foreignField: "Id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "instructors",
          localField: "course.InstructorId",
          foreignField: "Id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $sort: { CreatedAt: -1 },
      },
    ]);

    res.json(feedback);
  } catch (error) {
    console.error("Error fetching student feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if student has submitted feedback for a course
router.get("/check/:courseId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const courseId = parseInt(req.params.courseId);
    const feedback = await Feedback.findOne({
      CourseId: courseId,
      StudentId: req.user.userId,
    });

    res.json({ hasSubmitted: !!feedback });
  } catch (error) {
    console.error("Error checking feedback status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
