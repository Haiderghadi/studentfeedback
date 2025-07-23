// src/components/CourseCard.js
import React from "react";

const CourseCard = ({ course, onFeedback }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow transition-shadow">
      <div>
        <h4 className="text-lg font-semibold text-gray-800">{course.Name}</h4>
        <p className="text-sm text-gray-500">
          Instructor: {course.instructor.FullName}
        </p>
      </div>
      <button
        onClick={onFeedback}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
      >
        Give Feedback
      </button>
    </div>
  );
};

export default CourseCard;
