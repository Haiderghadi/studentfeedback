const express = require("express");
const Feedback = require("../models/Feedback");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const { authenticateToken } = require("./auth");

const router = express.Router();

router.get("/reports/courses", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { search } = req.query;

    // Build match criteria for search
    let matchCriteria = {};
    if (search) {
      const courses = await Course.find({
        Name: { $regex: search, $options: "i" },
      }).select("Id");

      if (courses.length > 0) {
        matchCriteria.CourseId = { $in: courses.map((c) => c.Id) };
      } else {
        // If no courses match, return empty array
        return res.json([]);
      }
    }

    const courseReports = await Feedback.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: "$CourseId",
          averageRating: { $avg: "$Rating" },
          totalFeedback: { $sum: 1 },
          ratings: { $push: "$Rating" },
          comments: { $push: "$Comment" },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "Id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $lookup: {
          from: "instructors",
          localField: "courseInfo.InstructorId",
          foreignField: "Id",
          as: "instructorInfo",
        },
      },
      {
        $unwind: "$instructorInfo",
      },
      {
        $project: {
          _id: 0,
          CourseId: "$_id",
          CourseName: "$courseInfo.Name",
          InstructorId: "$courseInfo.InstructorId",
          InstructorName: "$instructorInfo.FullName",
          averageRating: 1,
          totalFeedback: 1,
          ratings: 1,
          comments: 1,
        },
      },
      {
        $sort: { averageRating: -1 },
      },
    ]);

    res.json(courseReports);
  } catch (error) {
    console.error("Error generating course reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Instructor-wise feedback aggregation
router.get("/reports/instructors", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const instructorReports = await Feedback.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "CourseId",
          foreignField: "Id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $group: {
          _id: "$courseInfo.InstructorId",
          averageRating: { $avg: "$Rating" },
          totalFeedback: { $sum: 1 },
          ratings: { $push: "$Rating" },
          comments: { $push: "$Comment" },
          courses: { $addToSet: "$courseInfo.Name" },
        },
      },
      {
        $lookup: {
          from: "instructors",
          localField: "_id",
          foreignField: "Id",
          as: "instructorInfo",
        },
      },
      { $unwind: "$instructorInfo" },
      {
        $project: {
          _id: 0,
          InstructorId: "$_id",
          InstructorName: "$instructorInfo.FullName",
          Department: "$instructorInfo.Department",
          averageRating: 1,
          totalFeedback: 1,
          ratings: 1,
          comments: 1,
          courses: 1,
        },
      },
      { $sort: { averageRating: -1 } },
    ]);

    res.json(instructorReports);
  } catch (error) {
    console.error("Error generating instructor reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
