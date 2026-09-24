import { useState } from "react";
import api from "../services/api";

const EndAttendance = () => {
    const [sessionId, setSessionId] = useState("");
    const [message, setMessage] = useState("");

    const endSession = async () => {
        if (!sessionId.trim()) {
            alert("Please enter the session ID");
            return;
        }

        try {
            const response = await api.patch(
                `/attendance-sessions/${sessionId}/end`
            );

            console.log("End session response:", response.data);

            setMessage("Attendance session ended successfully");
            setSessionId("");

        } catch (error) {
            console.log(
                error.response?.data ||
                "Failed to end attendance session"
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to end attendance session"
            );
        }
    };

    return (
        <div>
            <h1>End Attendance Session</h1>

            <input
                type="text"
                placeholder="Enter Session ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
            />

            <br />
            <br />

            <button onClick={endSession}>
                End Attendance
            </button>

            {message && (
                <p>{message}</p>
            )}
        </div>
    );
};

export default EndAttendance;