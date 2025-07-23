import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import feedbackService from "../services/feedback";
import ReportCard from "../components/ReportCard";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [courseReports, setCourseReports] = useState([]);
  const [instructorReports, setInstructorReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeReportType, setActiveReportType] = useState("courses");

  useEffect(() => {
    const fetchReports = async () => {
      if (user?.role === "admin") {
        try {
          const fetchedCourseReports =
            await feedbackService.getCourseFeedbackReports(searchTerm);
          setCourseReports(fetchedCourseReports);

          const fetchedInstructorReports =
            await feedbackService.getInstructorFeedbackReports();
          setInstructorReports(fetchedInstructorReports);
        } catch (err) {
          setError("Failed to fetch feedback reports. Please try again later.");
          console.error("Error fetching reports:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("You are not authorized to view this page.");
      }
    };

    fetchReports();
  }, [user, searchTerm]);

  const displayedReports =
    activeReportType === "courses" ? courseReports : instructorReports;

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Loading reports...</div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!user || user.role !== "admin")
    return (
      <div className="text-center text-gray-700 py-10">
        Please login as an admin to view this page.
      </div>
    );

  const exportToCSV = (data, fileName) => {
    const replacer = (key, value) => (value === null ? "" : value);
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","), // header row
      ...data.map((row) =>
        headers
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-row justify-between items-center">
        {" "}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Admin Dashboard - Feedback Reports 📊
        </h2>
        <button
          onClick={() =>
            exportToCSV(displayedReports, `${activeReportType}-feedback`)
          }
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Export to CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveReportType("courses")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeReportType === "courses"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Course Reports
        </button>
        <button
          onClick={() => setActiveReportType("instructors")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeReportType === "instructors"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Instructor Reports
        </button>
      </div>

      {activeReportType === "courses" && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {displayedReports.length === 0 ? (
        <p className="text-gray-500">
          No {activeReportType} feedback reports available or matching your
          search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReports.map((report) => (
            <ReportCard
              key={report.Id}
              report={report}
              reportType={activeReportType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
