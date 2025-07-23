// src/services/feedback.js
import axios from "axios";
import config from "../config";
import authService from "./auth";

const API_URL = config.API_BASE_URL;

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getEnrolledCourses = async () => {
  // Endpoint changed to /courses/enrolled
  const response = await axios.get(
    `${API_URL}/courses/enrolled`,
    getAuthHeaders()
  );
  return response.data;
};

const getCourseById = async (courseId) => {
  // Endpoint changed to /courses/:id
  const response = await axios.get(
    `${API_URL}/courses/${courseId}`,
    getAuthHeaders()
  );
  return response.data;
};

const submitFeedback = async (feedbackData) => {
  // Endpoint changed to /feedbacks/submit
  const response = await axios.post(
    `${API_URL}/feedback/submit`,
    feedbackData,
    getAuthHeaders()
  );
  return response.data;
};

const hasStudentSubmittedFeedback = async (courseId) => {
  // Endpoint /feedbacks/check/:courseId
  try {
    const response = await axios.get(
      `${API_URL}/feedback/check/${courseId}`,
      getAuthHeaders()
    );
    return response.data.hasSubmitted; // Assuming backend returns { hasSubmitted: true/false }
  } catch (error) {
    // If the backend returns a 404 or similar for no feedback, handle it
    if (error.response && error.response.status === 404) {
      return false;
    }
    console.error("Error checking feedback status:", error);
    throw error;
  }
};

const getCourseFeedbackReports = async (searchTerm = "") => {
  // Endpoint changed to /admin/reports/courses
  const response = await axios.get(
    `${API_URL}/admin/reports/courses?search=${searchTerm}`,
    getAuthHeaders()
  );
  return response.data;
};

const getInstructorFeedbackReports = async () => {
  // Endpoint changed to /admin/reports/instructors
  const response = await axios.get(
    `${API_URL}/admin/reports/instructors`,
    getAuthHeaders()
  );
  return response.data;
};

export default {
  getEnrolledCourses,
  getCourseById,
  submitFeedback,
  hasStudentSubmittedFeedback,
  getCourseFeedbackReports,
  getInstructorFeedbackReports,
};
