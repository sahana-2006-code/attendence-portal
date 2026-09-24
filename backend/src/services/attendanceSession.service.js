import AttendanceSession from "../models/AttendanceSession.js";
import Subject from "../models/Subject.js";
import crypto from "crypto";
import QRCode from "qrcode";
import AppError from "../utils/AppError.js";
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
export const startAttendanceSession = async (data, facultyId) => {

    const {
        subjectId,
        campusLatitude,
        campusLongitude,
        campusRadius
    } = data;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    if (subject.faculty.toString() !== facultyId) {
        throw new AppError("You are not assigned to this subject", 403);
    }

    const activeSession = await AttendanceSession.findOne({
        subject: subjectId,
        isActive: true,
    });

    if (activeSession) {
        throw new AppError("Attendance session already active", 409);
    }

    const session = await AttendanceSession.create({
        subject: subjectId,
        faculty: facultyId,
        campusLatitude,
        campusLongitude,
        campusRadius,
        isActive: true,
    });

    return session;
};
export const endAttendanceSession = async (sessionId, facultyId) => {

    const session = await AttendanceSession.findById(sessionId);

    if (!session) {
        throw new AppError("Attendance session not found", 404);
    }

    if (session.faculty.toString() !== facultyId) {
        throw new AppError("Unauthorized", 403);
    }

    session.isActive = false;
    session.endTime = new Date();

    await session.save();

    return session;
};
export const generateQRCode = async (sessionId, facultyId) => {

    const session = await AttendanceSession.findById(sessionId);

    if (!session) {
        throw new AppError("Attendance session not found", 404);
    }

    if (session.faculty.toString() !== facultyId) {
        throw new AppError("Unauthorized", 403);
    }

    if (!session.isActive) {
        throw new AppError("Attendance session has ended", 400);
    }

    // Generate random QR token
    const qrToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 5 seconds
    const expiry = new Date(Date.now() + 5 * 1000);

    session.qrToken = qrToken;
    session.qrExpiresAt = expiry;

    await session.save();

    const qrImage = await QRCode.toDataURL(qrToken);

    return {
        qrToken,
        qrImage,
        expiresAt: expiry,
    };
};
export const getFacultySessions = async (facultyId) => {
    const sessions = await AttendanceSession.find({
        faculty: facultyId,
    })
        .populate("subject", "subjectName subjectCode")
        .sort({ createdAt: -1 });

    return sessions;
};