import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [historyResponse, percentageResponse] = await Promise.all([
          api.get("/attendance/history"),
          api.get("/attendance/percentage"),
        ]);
        setAttendance(historyResponse.data.data || []);
        setPercentage(percentageResponse.data.data || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance data");
      } finally { setLoading(false); }
    };
    fetchStudentData();
  }, []);

  if (loading) return <div className="loading">Loading your attendance...</div>;

  const overall = percentage?.overall || { totalClasses: 0, presentClasses: 0, absentClasses: 0, percentage: 0 };
  const progress = Math.max(0, Math.min(100, Number(overall.percentage) || 0));

  return (
    <div>
      <div className="hero-welcome">
        <h1>Welcome back, {user.name?.split(" ")[0] || "Student"}.</h1>
        <p>{user.department || "—"} · Semester {user.semester || "—"} · Section {user.section || "—"}</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="action-card">
        <div><h2>Ready to mark attendance?</h2><p>Scan the faculty QR code and allow location access.</p></div>
        <Link className="btn" to="/student/attendance">Mark attendance →</Link>
      </div>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="card overall-card">
          <div className="ring" style={{ "--progress": progress }}><strong>{progress}%</strong></div>
          <div className="overall-copy"><strong>Overall attendance</strong><span>{overall.presentClasses} present of {overall.totalClasses} total classes</span><div className="progress-wrap"><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></div></div>
        </div>
        <div className="grid grid-3">
          <div className="card stat-card"><div className="stat-label">Total classes</div><div className="stat-value">{overall.totalClasses}</div></div>
          <div className="card stat-card"><div className="stat-label">Present</div><div className="stat-value" style={{ color: "#15803d" }}>{overall.presentClasses}</div></div>
          <div className="card stat-card"><div className="stat-label">Absent</div><div className="stat-value" style={{ color: "#dc2626" }}>{overall.absentClasses}</div></div>
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        <h2 className="section-title">Subject attendance</h2>
        {!percentage?.subjects?.length ? <div className="card empty-state"><strong>No subject data yet</strong>Your attendance breakdown will appear here once classes are conducted.</div> : <div className="grid grid-3">{percentage.subjects.map((subject) => <div className="card subject-card" key={subject.subjectId}><div className="subject-code">{subject.subjectCode}</div><div className="subject-name">{subject.subjectName}</div><div className="stat-top"><span className="stat-label">Attendance</span><strong style={{ fontSize: 15, color: subject.percentage >= 75 ? "#15803d" : "#b45309" }}>{subject.percentage}%</strong></div><div className="progress-wrap"><div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(subject.percentage, 100)}%` }} /></div></div><div className="meta-row" style={{ marginTop: 13 }}><span className="meta-chip">{subject.presentClasses} present</span><span className="meta-chip">{subject.absentClasses} absent</span></div></div>)}</div>}
      </div>

      <div style={{ marginTop: 26 }} className="card history-card">
        <div className="history-head"><h2>Recent attendance</h2><span style={{ color: "#98a2b3", fontSize: 10 }}>{attendance.length} records</span></div>
        {attendance.length === 0 ? <div className="empty-state"><strong>No attendance records</strong>Scan a faculty QR code to record your first attendance.</div> : <div className="table-wrap"><table><thead><tr><th>Subject</th><th>Faculty</th><th>Status</th><th>Date & time</th></tr></thead><tbody>{attendance.slice(0, 10).map((record) => <tr key={record._id}><td><strong>{record.subject?.subjectName || "—"}</strong><br /><span style={{ color: "#98a2b3", fontSize: 10 }}>{record.subject?.subjectCode || ""}</span></td><td>{record.faculty?.name || "—"}</td><td><span className={`badge ${record.status === "Present" ? "badge-success" : "badge-danger"}`}>{record.status}</span></td><td>{record.attendanceTime ? new Date(record.attendanceTime).toLocaleString() : "—"}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
};

export default StudentDashboard;
