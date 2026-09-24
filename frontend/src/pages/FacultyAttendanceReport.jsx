import { useEffect, useState } from "react";
import api from "../services/api";

const FacultyAttendanceReport = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [report, setReport] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/attendance-sessions");
        setSessions(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance sessions");
      }
    };
    fetchSessions();
  }, []);

  const fetchReport = async () => {
    if (!sessionId) { setError("Select a session to view its report."); return; }
    try {
      setLoading(true); setError(""); setReport(null);
      const response = await api.get(`/attendance/report/session/${sessionId}`);
      setSelectedSession(sessions.find((item) => item._id === sessionId) || null);
      setReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance report");
    } finally { setLoading(false); }
  };

  const date = report?.startTime || selectedSession?.startTime || selectedSession?.createdAt;

  return (
    <div>
      <div className="page-header"><div><h1>Attendance reports</h1><p>Review who attended each class session.</p></div></div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="form-grid" style={{ alignItems: "end" }}>
          <div className="form-field full"><label>Attendance session</label><select className="select-control" value={sessionId} onChange={(e) => setSessionId(e.target.value)}><option value="">Select a session</option>{sessions.map((session) => <option key={session._id} value={session._id}>{session.subject?.subjectName || "Subject"} · {session.subject?.subjectCode || ""} · {session.startTime ? new Date(session.startTime).toLocaleString() : "N/A"}</option>)}</select></div>
        </div>
        <div className="form-actions" style={{ justifyContent: "flex-start" }}><button className="btn btn-primary" onClick={fetchReport} disabled={loading || !sessionId}>{loading ? "Loading report..." : "View report →"}</button></div>
      </div>

      {loading && <div className="loading">Loading attendance report...</div>}

      {report && !loading && (
        <>
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div><span className="subject-code">{report.subject?.subjectCode}</span><h2 style={{ margin: "6px 0 4px", fontSize: 20, color: "#101828" }}>{report.subject?.subjectName}</h2><p style={{ margin: 0, color: "#667085", fontSize: 11 }}>{report.subject?.department} · Semester {report.subject?.semester} · Section {report.subject?.section}</p></div>
              <div style={{ textAlign: "right" }}><span style={{ color: "#98a2b3", fontSize: 9, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>Session time</span><div style={{ marginTop: 5, color: "#344054", fontSize: 12, fontWeight: 600 }}>{date ? new Date(date).toLocaleString() : "—"}</div></div>
            </div>
          </div>

          <div className="report-summary" style={{ marginBottom: 16 }}>
            <div className="report-stat"><span>Total students</span><strong>{report.totalStudents}</strong></div>
            <div className="report-stat"><span>Present</span><strong style={{ color: "#15803d" }}>{report.presentStudents}</strong></div>
            <div className="report-stat"><span>Absent</span><strong style={{ color: "#dc2626" }}>{report.absentStudents}</strong></div>
            <div className="report-stat"><span>Attendance</span><strong>{report.attendancePercentage}%</strong></div>
          </div>

          <div className="card history-card">
            <div className="history-head"><h2>Student attendance</h2><span style={{ color: "#98a2b3", fontSize: 10 }}>{report.students?.length || 0} students</span></div>
            {!report.students?.length ? <div className="empty-state"><strong>No students found</strong>No students match this class.</div> : <div className="table-wrap"><table><thead><tr><th>Student</th><th>Roll number</th><th>Email</th><th>Status</th><th>Attendance time</th></tr></thead><tbody>{report.students.map((item) => <tr key={item.student?._id}><td><strong>{item.student?.name || "—"}</strong></td><td>{item.student?.rollNumber || "—"}</td><td>{item.student?.email || "—"}</td><td><span className={`badge ${item.status === "Present" ? "badge-success" : "badge-danger"}`}>{item.status}</span></td><td>{item.attendanceTime ? new Date(item.attendanceTime).toLocaleString() : "—"}</td></tr>)}</tbody></table></div>}
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyAttendanceReport;
