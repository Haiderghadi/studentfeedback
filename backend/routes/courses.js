const express = require("express");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Enrollment = require("../models/Enrollment");
const { authenticateToken } = require("./auth");

const router = express.Router();

// Get all courses (for admin)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "instructors",
          localField: "InstructorId",
          foreignField: "Id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $project: {
          Id: 1,
          Name: 1,
          InstructorId: 1,
          "instructor.FullName": 1,
          "instructor.Department": 1,
        },
      },
      {
        $sort: { Name: 1 },
      },
    ]);

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get enrolled courses for student
router.get("/enrolled", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const enrolledCourses = await Enrollment.aggregate([
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
        $project: {
          "course.Id": 1,
          "course.Name": 1,
          "course.InstructorId": 1,
          "instructor.FullName": 1,
          "instructor.Department": 1,
        },
      },
      {
        $sort: { "course.Name": 1 },
      },
    ]);

    res.json(
      enrolledCourses.map((item) => ({
        ...item.course,
        instructor: item.instructor,
      }))
    );
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single course by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await Course.aggregate([
      {
        $match: { Id: courseId },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "InstructorId",
          foreignField: "Id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
    ]);

    if (!course.length) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course[0]);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
