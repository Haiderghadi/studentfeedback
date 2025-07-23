import React from "react";

const ReportCard = ({ report, reportType }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 font-bold";
    if (rating >= 2.5) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const ratingValue = report.averageRating ?? null;
  const ratingText = ratingValue ? ratingValue.toFixed(1) : "N/A";
  const ratingColor = ratingValue
    ? getRatingColor(ratingValue)
    : "text-gray-400";

  return (
    <div className="border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {reportType === "courses"
          ? `Course: ${report.CourseName}`
          : `Instructor: ${report.InstructorName}`}
      </h3>

      {reportType === "courses" && report.InstructorName && (
        <p className="text-sm text-gray-500 mb-2">
          Instructor: {report.InstructorName}
        </p>
      )}

      <p className="mb-3 text-lg">
        <strong>Average Rating:</strong>{" "}
        <span className={ratingColor}>{ratingText}</span>
      </p>

      <h4 className="font-medium mb-2 text-gray-700">Comments:</h4>
      {report.comments && report.comments.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {report.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No comments available.</p>
      )}
    </div>
  );
};

export default ReportCard;
