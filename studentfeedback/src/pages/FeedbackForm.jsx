// src/pages/FeedbackForm.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import feedbackService from "../services/feedback";
import StarRating from "../components/StarRating";

const FeedbackForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchDetailsAndCheckSubmission = async () => {
      if (user?.role === "student" && courseId) {
        try {
          const details = await feedbackService.getCourseById(courseId);
          setCourseDetails(details);

          const submitted = await feedbackService.hasStudentSubmittedFeedback(
            courseId
          );
          setHasSubmitted(submitted);
        } catch (err) {
          setError("Failed to load course details or check feedback status.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("You must be logged in as a student to submit feedback.");
      }
    };

    fetchDetailsAndCheckSubmission();
  }, [courseId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (hasSubmitted) {
      setError("You have already submitted feedback for this course.");
      return;
    }

    try {
      await feedbackService.submitFeedback({
        courseId: parseInt(courseId),
        rating,
        comment,
      });

      setMessage("Feedback submitted successfully! 🎉");
      setHasSubmitted(true);
      setTimeout(() => navigate("/student/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
      console.error("Error submitting feedback:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Loading feedback form...
      </div>
    );

  if (error && !message)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  if (!user || user.role !== "student")
    return (
      <div className="text-center text-gray-600 py-10">
        Please login as a student.
      </div>
    );

  if (!courseDetails)
    return (
      <div className="text-center text-gray-500 py-10">
        Course not found or inaccessible.
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      {!hasSubmitted && (
        <>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Submit Feedback for {courseDetails.CourseName}
          </h2>
          <p className="mb-4 text-gray-600">
            Instructor: {courseDetails.InstructorName}
          </p>
        </>
      )}

      {hasSubmitted ? (
        <div className="text-orange-500 font-semibold">
          You have already submitted feedback for this course. You cannot submit
          again.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Rating (1-5):
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Comment:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your anonymous feedback here..."
            ></textarea>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={hasSubmitted}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              hasSubmitted
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
