require("dotenv").config();
const mongoose = require("mongoose");
const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const Student = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Feedback = require("../models/Feedback");

async function seedData() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/student-feedback",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Instructor.deleteMany({}),
      Course.deleteMany({}),
      Student.deleteMany({}),
      Enrollment.deleteMany({}),
      Feedback.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Seed Instructors
    const instructors = [
      { Id: 1, FullName: "Dr. Sarah Johnson", Department: "Computer Science" },
      { Id: 2, FullName: "Prof. Michael Chen", Department: "Computer Science" },
      { Id: 3, FullName: "Dr. Emily Rodriguez", Department: "Computer Science" },
      { Id: 4, FullName: "Prof. David Kim", Department: "Software Engineering" },
      { Id: 5, FullName: "Dr. Jennifer Adams", Department: "Mathematics" },
    ];
    await Instructor.insertMany(instructors);
    console.log("Seeded instructors");

    // Seed Courses
    const courses = [
      { Id: 101, Name: "Introduction to Computer Science", InstructorId: 1 },
      { Id: 201, Name: "Data Structures and Algorithms", InstructorId: 2 },
      { Id: 301, Name: "Database Systems", InstructorId: 3 },
      { Id: 401, Name: "Software Engineering", InstructorId: 4 },
      { Id: 501, Name: "Calculus II", InstructorId: 5 },
    ];
    await Course.insertMany(courses);
    console.log("Seeded courses");

    // Seed Students
    const students = [
      { Id: 1, FullName: "Aisha Al-Harbi", Email: "aisha@ktu.edu.kw", username: "aisha", role: "student" },
      { Id: 2, FullName: "Fahad Al-Mutairi", Email: "fahad@ktu.edu.kw", username: "fahad", role: "student" },
      { Id: 999, FullName: "System Administrator", Email: "admin@ktu.edu.kw", username: "admin1", role: "admin" },
    ];
    await Student.insertMany(students);
    console.log("Seeded students");

    // Seed Enrollments (enroll both students in all courses)
    let enrollmentId = 1;
    const enrollments = [];
    for (const student of students) {
      for (const course of courses) {
        if (student.role === "student") {
          enrollments.push({
            Id: enrollmentId++,
            StudentId: student.Id,
            CourseId: course.Id,
          });
        }
      }
    }
    await Enrollment.insertMany(enrollments);
    console.log("Seeded enrollments");

    // Seed Feedback (each student gives feedback for first course)
    let feedbackId = 1;
    const feedbacks = [
      {
        Id: feedbackId++,
        StudentId: 1,
        CourseId: 101,
        Rating: 5,
        Comment: "Excellent course! The instructor explained concepts very clearly.",
        CreatedAt: new Date(),
      },
      {
        Id: feedbackId++,
        StudentId: 2,
        CourseId: 101,
        Rating: 4,
        Comment: "Good course overall. Could use more practical examples.",
        CreatedAt: new Date(),
      },
    ];
    await Feedback.insertMany(feedbacks);
    console.log("Seeded feedback");

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
