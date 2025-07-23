// src/pages/StudentDashboard.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import feedbackService from "../services/feedback";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.role === "student") {
        try {
          const enrolledCourses = await feedbackService.getEnrolledCourses();
          setCourses(enrolledCourses);
        } catch (err) {
          setError("Failed to fetch courses. Please try again later.");
          console.error("Error fetching courses:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("You are not authorized to view this page.");
      }
    };

    fetchCourses();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading courses...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  if (!user || user.role !== "student")
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700">
        Please login as a student to view this page.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Welcome, {user.FullName}! 👋
      </h2>
      <h3 className="text-gray-600 mb-6">
        Your Enrolled Courses:{" "}
        <span className="font-medium">{courses.length}</span>
      </h3>

      {courses.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any courses.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              onFeedback={() => navigate(`/student/feedback/${course.Id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
