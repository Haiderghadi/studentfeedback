import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import FeedbackForm from "./pages/FeedbackForm";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-700 text-lg">
        Loading application...
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Router>
      <nav className="flex justify-between items-center px-5 py-3 bg-gray-100 border-b border-gray-300">
        <Link
          to="/"
          className="text-blue-600 font-bold text-xl hover:underline"
        >
          Student Feedback System
        </Link>
        <div>
          {user ? (
            <>
              <span className="mr-4 text-sm text-gray-700">
                Logged in as:{" "}
                <strong>
                  {user.name} ({user.role})
                </strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-gray-600 text-sm hover:underline">
              Login
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route
            path="/student/feedback/:courseId"
            element={<FeedbackForm />}
          />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-24 text-2xl font-semibold text-gray-600">
              404 - Page Not Found 😔
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
