import { markAttendance } from "../services/attendance.service.js";
import {
    startAttendanceSession,
    endAttendanceSession,
    generateQRCode,
} from "../services/attendanceSession.service.js";
import {
    getStudentAttendanceHistory,
    getAttendancePercentage,
    getSessionAttendance,
} from "../services/attendance.service.js";
import ApiResponse from "../utils/apiResponse.js";
// Student Marks Attendance

// Student Attendance History
export const history = async (req, res, next) => {

    try {

        const attendance = await getStudentAttendanceHistory(
            req.user.id
        );

        return res.status(200).json(
    new ApiResponse(
        200,
        "Attendance history fetched successfully",
        attendance
    )
);
    } catch (error) {
        next(error);
    }

};

// Student Attendance Percentage
export const percentage = async (req, res, next) => {

    try {

        const result = await getAttendancePercentage(
            req.user.id
        );
return res.status(200).json(
    new ApiResponse(
        200,
        "Attendance percentage fetched successfully",
        result
    )
);

    } catch (error) {
        next(error);
    }

};

// Faculty Session Report
export const sessionReport = async (req, res, next) => {

    try {

        const report = await getSessionAttendance(
            req.params.sessionId
        );

        res.status(200).json({
            success: true,
            count: report.length,
            data: report,
        });

    } catch (error) {
        next(error);
    }

};
export const mark = async (req, res, next) => {
    try {

        const attendance = await markAttendance(
            req.body,
            req.user.id
        );

       return res.status(201).json(
    new ApiResponse(
        201,
        "Attendance marked successfully",
        attendance
    )
);

    } catch (error) {
        next(error);
    }
};
export const generateQR = async (req, res, next) => {
    try {

        const qr = await generateQRCode(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "QR generated successfully",
            data: qr,
        });

    } catch (error) {
        next(error);
    }
};
export const startSession = async (req, res, next) => {
    try {

        const session = await startAttendanceSession(
            req.body.subjectId,
            req.user.id
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                "Attendance session started successfully",
                session
            )
        );

    } catch (error) {
        next(error);
    }
};