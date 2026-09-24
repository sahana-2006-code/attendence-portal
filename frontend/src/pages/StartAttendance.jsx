import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import api from "../services/api";

const QR_REFRESH_MS = 4000;

const StartAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [qrData, setQrData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const rotationRef = useRef(null);
  const generatingRef = useRef(false);

  const clearRotation = () => {
    if (rotationRef.current) {
      clearInterval(rotationRef.current);
      rotationRef.current = null;
    }
  };

  const generateQRForSession = async (id, silent = false) => {
    if (!id || generatingRef.current) return;
    try {
      generatingRef.current = true;
      if (!silent) {
        setLoading(true);
        setMessage("Generating a secure QR code...");
        setMessageType("info");
      }

      const response = await api.post(`/attendance-sessions/${id}/generate-qr`);
      const data = response.data.data;
      setQrData(data);
      setQrImage(await QRCode.toDataURL(data.qrToken, { width: 300, margin: 2 }));
      setSecondsLeft(Math.max(0, Math.ceil((new Date(data.expiresAt).getTime() - Date.now()) / 1000)));
      if (!silent) {
        setMessage("QR code is live. It automatically changes every 4 seconds.");
        setMessageType("success");
      }
    } catch (error) {
      if (!silent) {
        setMessage(error.response?.data?.message || "Failed to generate QR");
        setMessageType("error");
      }
    } finally {
      generatingRef.current = false;
      if (!silent) setLoading(false);
    }
  };

  const startRotation = (id) => {
    clearRotation();
    generateQRForSession(id, true);
    rotationRef.current = setInterval(() => generateQRForSession(id, true), QR_REFRESH_MS);
  };

  const loadInitialData = async () => {
    try {
      const [subjectsResponse, sessionsResponse] = await Promise.all([
        api.get("/subjects"),
        api.get("/attendance-sessions"),
      ]);

      const loadedSubjects = subjectsResponse.data.data || [];
      setSubjects(loadedSubjects);

      const activeSession = (sessionsResponse.data.data || []).find((session) => session.isActive);
      if (activeSession) {
        setSessionId(activeSession._id);
        setSubjectId(activeSession.subject?._id || activeSession.subject || "");
        setLocationReady(true);
        setMessage("An attendance session is already live. The QR code is rotating automatically.");
        setMessageType("success");
        startRotation(activeSession._id);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load attendance data");
      setMessageType("error");
    }
  };

  useEffect(() => {
    loadInitialData();
    return () => clearRotation();
  }, []);

  useEffect(() => {
    if (!qrData?.expiresAt) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((new Date(qrData.expiresAt).getTime() - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(timer);
  }, [qrData]);

  const getLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation is not supported by this browser."));
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) => reject(new Error(error.code === 1 ? "Location permission denied. Allow location access to start attendance." : error.code === 2 ? "Unable to determine your location." : error.code === 3 ? "Location request timed out." : "Failed to get your location.")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  const startSession = async () => {
    if (!subjectId) {
      setMessage("Select a subject before starting the session.");
      setMessageType("error");
      return;
    }
    try {
      setLoading(true);
      setMessage("Checking your location...");
      setMessageType("info");
      const location = await getLocation();
      setLocationReady(true);
      const response = await api.post("/attendance-sessions/start", {
        subjectId,
        campusLatitude: location.latitude,
        campusLongitude: location.longitude,
        campusRadius: 100,
      });
      const id = response.data.data._id;
      setSessionId(id);
      setMessage("Session started. QR is now rotating automatically.");
      setMessageType("success");
      startRotation(id);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to start attendance session");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      clearRotation();
      await api.patch(`/attendance-sessions/${sessionId}/end`);
      setMessage("Attendance session ended successfully.");
      setMessageType("success");
      setSessionId("");
      setQrImage("");
      setQrData(null);
      setSecondsLeft(0);
      setLocationReady(false);
      setSubjectId("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to end attendance session");
      setMessageType("error");
      startRotation(sessionId);
    } finally {
      setLoading(false);
    }
  };

  const selectedSubject = subjects.find((subject) => subject._id === subjectId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{sessionId ? "Live attendance session" : "Start attendance"}</h1>
          <p>{sessionId ? "The QR code changes automatically while this class is live." : "Run a secure QR attendance session for one class."}</p>
        </div>
      </div>

      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      {!sessionId ? (
        <div className="card form-card">
          <h2 className="section-title">Set up session</h2>
          <div className="step-list" style={{ marginBottom: 25 }}>
            <div className="step"><span className="step-number">1</span><div><strong>Select the class</strong><span>Choose the subject you are taking attendance for.</span></div></div>
            <div className="step"><span className="step-number">2</span><div><strong>Verify your location</strong><span>Your browser location is used as the session's attendance area.</span></div></div>
            <div className="step"><span className="step-number">3</span><div><strong>Display the QR code</strong><span>The QR automatically rotates every 4 seconds.</span></div></div>
          </div>
          <div className="form-field" style={{ maxWidth: 620 }}>
            <label>Subject</label>
            <select className="select-control" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Select a subject</option>
              {subjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.subjectName} · {subject.subjectCode} · Sem {subject.semester} · Sec {subject.section}</option>)}
            </select>
          </div>
          <div className="form-actions" style={{ justifyContent: "flex-start" }}>
            <button className="btn btn-primary" onClick={startSession} disabled={loading || !subjectId}>{loading ? "Starting..." : "Start attendance →"}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="qr-layout">
            <div className="card qr-card">
              {qrImage ? <img src={qrImage} alt="Rotating attendance QR Code" /> : <div className="empty-state"><strong>Preparing QR code...</strong>Please wait a moment.</div>}
            </div>
            <div className="card session-info">
              <span className="badge badge-success" style={{ width: "fit-content" }}>● LIVE SESSION</span>
              <h2 style={{ margin: "13px 0 5px", fontSize: 22, color: "#101828" }}>{selectedSubject?.subjectName || "Attendance session"}</h2>
              <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>{selectedSubject?.subjectCode} · Semester {selectedSubject?.semester} · Section {selectedSubject?.section}</p>
              <div className="meta-row" style={{ marginTop: 18 }}><span className="meta-chip">Location verified: {locationReady ? "Yes" : "—"}</span><span className="meta-chip">Radius: 100 m</span></div>
              <div className="alert alert-info" style={{ marginTop: 18, marginBottom: 0 }}>
                QR refreshes automatically every <strong>4 seconds</strong>. Current QR expires in <strong>{secondsLeft}s</strong>.
              </div>
              <div className="page-actions" style={{ marginTop: 18 }}>
                <button className="btn btn-danger" onClick={endSession} disabled={loading}>{loading ? "Ending..." : "End session"}</button>
              </div>
            </div>
          </div>
          <div className="card card-pad" style={{ marginTop: 16 }}>
            <h2 className="section-title">While the session is live</h2>
            <p style={{ margin: 0, color: "#667085", fontSize: 12, lineHeight: 1.7 }}>Keep this page visible to the class. Students must scan the current QR and allow location access. Each QR token expires after 5 seconds, and a new token is generated automatically every 4 seconds.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StartAttendance;
