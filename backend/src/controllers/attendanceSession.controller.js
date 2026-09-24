import {
    startAttendanceSession,
    endAttendanceSession,
    getFacultySessions,
    generateQRCode,
} from "../services/attendanceSession.service.js";
export const startAttendance = async (req, res, next) => {

    try {
      // console.log("req.user =", req.user);
        const session = await startAttendanceSession(
            req.body,
            req.user.id
        );

        res.status(201).json({

            success: true,

            message: "Attendance session started",

            data: session,
        });

    } catch (error) {

        next(error);

    }

};

export const endAttendance = async (req, res, next) => {

    try {

        const session = await endAttendanceSession(

            req.params.id,

            req.user.id

        );

        res.status(200).json({

            success: true,

            message: "Attendance session ended",

            data: session,
        });

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
export const getSessions = async (req, res, next) => {
    try {
        const sessions = await getFacultySessions(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Faculty sessions fetched successfully",
            data: sessions,
        });
    } catch (error) {
        next(error);
    }
};