import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const FacultyDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/faculty");
        setDashboard(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };
    fetchDashboard();
  }, []);

  if (!dashboard && !error) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div>
      <div className="hero-welcome">
        <h1>Good to see you, {user.name?.split(" ")[0] || "Faculty"}.</h1>
        <p>Here is a quick overview of your attendance activity.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {dashboard && (
        <>
          <div className="grid grid-4">
            <div className="card stat-card"><div className="stat-top"><span className="stat-label">Subjects</span><span className="stat-icon">▤</span></div><div className="stat-value">{dashboard.totalSubjects}</div><div className="stat-note">Active subjects</div></div>
            <div className="card stat-card"><div className="stat-top"><span className="stat-label">Sessions</span><span className="stat-icon">◷</span></div><div className="stat-value">{dashboard.totalSessions}</div><div className="stat-note">Sessions conducted</div></div>
            <div className="card stat-card"><div className="stat-top"><span className="stat-label">Students present</span><span className="stat-icon">✓</span></div><div className="stat-value">{dashboard.totalStudentsPresent}</div><div className="stat-note">Attendance records</div></div>
            <div className="card stat-card"><div className="stat-top"><span className="stat-label">Today</span><span className="stat-icon">●</span></div><div className="stat-value">{dashboard.todaySessions}</div><div className="stat-note">Sessions today</div></div>
          </div>

          <div style={{ marginTop: 16 }} className="action-card">
            <div>
              <h2>Start a new attendance session</h2>
              <p>Select a subject, verify your location and display a QR code for students.</p>
            </div>
            <Link className="btn" to="/faculty/start-attendance">Start attendance →</Link>
          </div>

          <div style={{ marginTop: 24 }}>
            <h2 className="section-title">Quick actions</h2>
            <div className="grid grid-3">
              <Link className="card card-pad" style={{ textDecoration: "none" }} to="/faculty/subjects">
                <div className="stat-icon">▤</div><h3 style={{ margin: "14px 0 5px", fontSize: 14 }}>Manage subjects</h3><p style={{ margin: 0, color: "#98a2b3", fontSize: 11 }}>Create and review your subjects.</p>
              </Link>
              <Link className="card card-pad" style={{ textDecoration: "none" }} to="/faculty/start-attendance">
                <div className="stat-icon">＋</div><h3 style={{ margin: "14px 0 5px", fontSize: 14 }}>Run attendance</h3><p style={{ margin: 0, color: "#98a2b3", fontSize: 11 }}>Open a QR session for a class.</p>
              </Link>
              <Link className="card card-pad" style={{ textDecoration: "none" }} to="/faculty/attendance-report">
                <div className="stat-icon">▥</div><h3 style={{ margin: "14px 0 5px", fontSize: 14 }}>View reports</h3><p style={{ margin: 0, color: "#98a2b3", fontSize: 11 }}>Review present and absent students.</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyDashboard;
