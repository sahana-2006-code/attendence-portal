import Attendance from "../models/Attendance.js";
import AttendanceSession from "../models/AttendanceSession.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import AppError from "../utils/AppError.js";
import { calculateDistance } from "../utils/distanceCalculator.js";

const normalizeValue = (value) =>
    String(value || "").trim().toUpperCase();

const belongsToClass = (student, subject) => {
    return (
        normalizeValue(student.department) ===
            normalizeValue(subject.department) &&
        Number(student.semester) === Number(subject.semester) &&
        normalizeValue(student.section) ===
            normalizeValue(subject.section)
    );
};


// ======================================================
// Student Marks Attendance
// ======================================================

export const markAttendance = async (data, studentId) => {

    const {
        qrToken,
        latitude,
        longitude,
    } = data;

    // Find active attendance session
    const session = await AttendanceSession.findOne({
        qrToken,
        isActive: true,
    });

    if (!session) {
        throw new AppError("Invalid QR Code", 400);
    }

    // Check QR expiry
    if (
        !session.qrExpiresAt ||
        new Date() > session.qrExpiresAt
    ) {
        throw new AppError("QR Code Expired", 400);
    }

    const student = await User.findById(studentId);

    if (!student) {
        throw new AppError("Student not found", 404);
    }

    const subject = await Subject.findById(session.subject);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    if (!belongsToClass(student, subject)) {
        throw new AppError(
            "You do not belong to this class",
            403
        );
    }

    // Check duplicate attendance
    const alreadyMarked = await Attendance.findOne({
        student: studentId,
        session: session._id,
    });

    if (alreadyMarked) {
        throw new AppError("Attendance already marked", 409);
    }

    // Verify GPS location
    const distance = calculateDistance(
        latitude,
        longitude,
        session.campusLatitude,
        session.campusLongitude
    );

    if (distance > session.campusRadius) {
        throw new AppError(
            "You are outside the allowed campus area",
            403
        );
    }

    // Save attendance
    const attendance = await Attendance.create({
        student: studentId,
        faculty: session.faculty,
        subject: session.subject,
        session: session._id,
        studentLatitude: latitude,
        studentLongitude: longitude,
    });

    return attendance;
};


// ======================================================
// Student Attendance History
// ======================================================

export const getStudentAttendanceHistory = async (
    studentId
) => {

    return await Attendance.find({
        student: studentId,
    })
        .populate(
            "subject",
            "subjectName subjectCode"
        )
        .populate(
            "faculty",
            "name email"
        )
        .sort({
            attendanceTime: -1,
        });
};


// ======================================================
// Student Attendance Percentage
// Overall + Subject-wise
// ======================================================

export const getAttendancePercentage = async (
    studentId
) => {

    // Find student
    const student = await User.findById(
        studentId
    );

    if (!student) {
        throw new AppError("Student not found", 404);
    }

    // Find all subjects belonging to the
    // student's department, semester and section
    const subjects = await Subject.find({
        isActive: true,
        semester: Number(student.semester),
    }).select(
        "_id subjectName subjectCode department semester section"
    );

    const matchingSubjects = subjects.filter((subject) =>
        belongsToClass(student, subject)
    );

    // Store subject-wise statistics
    const subjectStats = [];

    // Overall counters
    let overallTotalClasses = 0;
    let overallPresentClasses = 0;

    // Calculate attendance for every subject
    for (const subject of matchingSubjects) {

        // Count classes conducted for this subject
        const totalClasses =
            await AttendanceSession.countDocuments({
                subject: subject._id,
            });

        // Count classes attended by this student
        const presentClasses =
            await Attendance.countDocuments({
                student: studentId,
                subject: subject._id,
                status: "Present",
            });

        // Calculate absent classes
        const absentClasses =
            Math.max(
                totalClasses - presentClasses,
                0
            );

        // Calculate subject percentage
        const percentage =
            totalClasses === 0
                ? 0
                : Number(
                      (
                          (presentClasses /
                              totalClasses) *
                          100
                      ).toFixed(2)
                  );

        // Add to subject-wise result
        subjectStats.push({
            subjectId: subject._id,
            subjectName:
                subject.subjectName,
            subjectCode:
                subject.subjectCode,
            totalClasses,
            presentClasses,
            absentClasses,
            percentage,
        });

        // Add to overall counters
        overallTotalClasses += totalClasses;
        overallPresentClasses += presentClasses;
    }

    // Calculate overall absent classes
    const overallAbsentClasses =
        Math.max(
            overallTotalClasses -
                overallPresentClasses,
            0
        );

    // Calculate overall percentage
    const overallPercentage =
        overallTotalClasses === 0
            ? 0
            : Number(
                  (
                      (overallPresentClasses /
                          overallTotalClasses) *
                      100
                  ).toFixed(2)
              );

    return {
        overall: {
            totalClasses:
                overallTotalClasses,

            presentClasses:
                overallPresentClasses,

            absentClasses:
                overallAbsentClasses,

            percentage:
                overallPercentage,
        },

        subjects: subjectStats,
    };
};


// ======================================================
// Faculty Report for One Session
// ======================================================

export const getSessionAttendance = async (
    sessionId
) => {

    // Find attendance session
    const session =
        await AttendanceSession.findById(
            sessionId
        ).populate(
            "subject",
            "subjectName subjectCode department semester section"
        );

    if (!session) {
        throw new AppError(
            "Attendance session not found",
            404
        );
    }

    const subject = session.subject;

    if (!subject) {
        throw new AppError(
            "Subject not found for this session",
            404
        );
    }

    // Find all eligible students
    const classStudents = await User.find({
        role: "student",
        isActive: true,
        semester: Number(subject.semester),
    }).select(
        "name rollNumber email department semester section"
    );

    const students = classStudents.filter((student) =>
        belongsToClass(student, subject)
    );

    // Find students who marked attendance
    const attendanceRecords =
        await Attendance.find({
            session: sessionId,
        })
            .populate(
                "student",
                "name rollNumber email"
            )
            .sort({
                attendanceTime: 1,
            });

    // Create map for quick lookup
    const attendanceMap = new Map();

    attendanceRecords.forEach((record) => {

        if (record.student) {
            attendanceMap.set(
                record.student._id.toString(),
                record
            );
        }

    });

    // Build complete student report
    const report = students.map(
        (student) => {

            const attendanceRecord =
                attendanceMap.get(
                    student._id.toString()
                );

            return {

                student: {
                    _id: student._id,
                    name: student.name,
                    rollNumber:
                        student.rollNumber,
                    email: student.email,
                },

                status: attendanceRecord
                    ? "Present"
                    : "Absent",

                attendanceTime:
                    attendanceRecord?.attendanceTime ||
                    null,

                attendanceId:
                    attendanceRecord?._id ||
                    null,
            };
        }
    );

    // Calculate totals
    const totalStudents =
        report.length;

    const presentStudents =
        report.filter(
            (student) =>
                student.status === "Present"
        ).length;

    const absentStudents =
        totalStudents -
        presentStudents;

    // Calculate attendance percentage
    const attendancePercentage =
        totalStudents === 0
            ? 0
            : Number(
                  (
                      (presentStudents /
                          totalStudents) *
                      100
                  ).toFixed(2)
              );

    return {

        sessionId: session._id,

        startTime: session.startTime,

        subject: {
            _id: subject._id,
            subjectName:
                subject.subjectName,
            subjectCode:
                subject.subjectCode,
            department:
                subject.department,
            semester:
                subject.semester,
            section:
                subject.section,
        },

        totalStudents,

        presentStudents,

        absentStudents,

        attendancePercentage,

        students: report,
    };
};