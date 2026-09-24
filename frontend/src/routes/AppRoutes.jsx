import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import FacultyDashboard from "../pages/FacultyDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import FacultySubjects from "../pages/FacultySubjects";
import StartAttendance from "../pages/StartAttendance";
import StudentAttendance from "../pages/StudentAttendance";
import FacultyAttendanceReport from "../pages/FacultyAttendanceReport";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/faculty/dashboard"
                element={
                    <ProtectedRoute role="faculty">
                        <FacultyDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/subjects"
                element={
                    <ProtectedRoute role="faculty">
                        <FacultySubjects />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/start-attendance"
                element={
                    <ProtectedRoute role="faculty">
                        <StartAttendance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/attendance-report"
                element={
                    <ProtectedRoute role="faculty">
                        <FacultyAttendanceReport />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute role="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/attendance"
                element={
                    <ProtectedRoute role="student">
                        <StudentAttendance />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;