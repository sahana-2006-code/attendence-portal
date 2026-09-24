import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";

const StudentAttendance = () => {
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const stopScanner = async () => {
    if (!scannerRef.current || !isScanningRef.current) return;
    try { await scannerRef.current.stop(); } catch { /* scanner may already be stopped */ }
    try { await scannerRef.current.clear(); } catch { /* scanner may already be cleared */ }
    isScanningRef.current = false;
    setScanning(false);
  };

  const getLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation is not supported by this browser."));
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) => reject(new Error(error.code === 1 ? "Location permission denied. Allow location access to mark attendance." : error.code === 2 ? "Unable to determine your location." : error.code === 3 ? "Location request timed out." : "Failed to get your location.")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  const handleScan = async (decodedText) => {
    if (!decodedText || loading || !isScanningRef.current) return;
    try {
      setLoading(true); setMessage("QR scanned. Getting your location..."); setMessageType("info");
      await stopScanner();
      const location = await getLocation();
      setMessage("Location obtained. Marking attendance...");
      const response = await api.post("/attendance/mark", { qrToken: decodedText, latitude: location.latitude, longitude: location.longitude });
      setSuccess(true);
      setMessage(response.data.message || "Attendance marked successfully"); setMessageType("success");
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.message || error.message || "Failed to mark attendance"); setMessageType("error");
    } finally { setLoading(false); }
  };

  const startScanner = async () => {
    try {
      setMessage(""); setSuccess(false);
      const scanner = new Html5Qrcode("student-qr-reader");
      scannerRef.current = scanner;
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, handleScan, () => {});
      isScanningRef.current = true;
      setScanning(true);
      setMessage("Point your camera at the faculty QR code."); setMessageType("info");
    } catch {
      isScanningRef.current = false; setScanning(false);
      setMessage("Unable to access camera. Please allow camera permission and try again."); setMessageType("error");
    }
  };

  useEffect(() => () => { stopScanner(); }, []);

  return (
    <div>
      <div className="page-header"><div><h1>Mark attendance</h1><p>Scan the QR code displayed by your faculty.</p></div></div>
      <div className="scanner-card card">
        {!success ? (
          <>
            <div className="alert alert-info" style={{ marginBottom: 18 }}>Keep your camera steady and make sure location services are enabled.</div>
            <div className="scanner-shell"><div id="student-qr-reader"></div></div>
            {!scanning && <div className="scanner-actions"><button className="btn btn-primary" onClick={startScanner} disabled={loading}>{loading ? "Processing..." : "Open camera"}</button></div>}
            {scanning && <div className="scanner-actions"><button className="btn btn-secondary" onClick={stopScanner} disabled={loading}>Stop camera</button></div>}
          </>
        ) : (
          <div className="success-panel">
            <div className="success-icon">✓</div>
            <h2 style={{ margin: "0 0 7px", color: "#166534", fontSize: 20 }}>Attendance marked</h2>
            <p style={{ margin: "0 0 18px", color: "#15803d", fontSize: 12 }}>Your attendance has been recorded successfully.</p>
            <div className="scanner-actions"><button className="btn btn-primary" onClick={() => { setSuccess(false); setMessage(""); }}>Scan again</button><Link className="btn btn-secondary" to="/student/dashboard">Go to dashboard</Link></div>
          </div>
        )}
        {message && !success && <p className={`status-text ${messageType === "error" ? "field-error" : ""}`}>{message}</p>}
      </div>
      <div style={{ textAlign: "center", marginTop: 15 }}><Link className="back-link" to="/student/dashboard">← Back to dashboard</Link></div>
    </div>
  );
};

export default StudentAttendance;
