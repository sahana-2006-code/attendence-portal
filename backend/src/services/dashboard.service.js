import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";
import AttendanceSession from "../models/AttendanceSession.js";

export const getFacultyDashboard = async (facultyId) => {

    // Total subjects handled by faculty
    const totalSubjects = await Subject.countDocuments({
        faculty: facultyId,
        isActive: true,
    });

    // Total attendance sessions conducted
    const totalSessions = await AttendanceSession.countDocuments({
        faculty: facultyId,
    });

    // Total students marked present
    const totalStudentsPresent = await Attendance.countDocuments({
        faculty: facultyId,
        status: "Present",
    });
    // Total unique students
const totalStudents = await Attendance.distinct(
    "student",
    {
        faculty: facultyId,
    }
);

    // Today's sessions
    const today = new Date();

    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
    );

    const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
    );

    const todaySessions = await AttendanceSession.countDocuments({
        faculty: facultyId,
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
    });
  // Overall attendance percentage
const totalAttendance = await Attendance.countDocuments({
    faculty: facultyId,
});

const attendancePercentage =
    totalAttendance === 0
        ? 0
        : Number(
              (
                  (totalStudentsPresent /
                      totalAttendance) *
                  100
              ).toFixed(2)
          );
    return {
        totalStudents: totalStudents.length,
        totalSubjects,
        totalSessions,
        attendancePercentage,
        totalStudentsPresent,
        todaySessions,
    };
};
//import Attendance from "../models/Attendance.js";

export const getStudentDashboard = async (studentId) => {

    // Total classes attended (Present + Absent)
    const totalClasses = await Attendance.countDocuments({
        student: studentId,
    });

    // Present classes
    const presentClasses = await Attendance.countDocuments({
        student: studentId,
        status: "Present",
    });

    // Absent classes
    const absentClasses = totalClasses - presentClasses;

    // Attendance percentage
    const attendancePercentage =
        totalClasses === 0
            ? 0
            : Number(((presentClasses / totalClasses) * 100).toFixed(2));

    // Recent attendance (Last 5 records)
    const recentAttendance = await Attendance.find({
        student: studentId,
    })
        .populate("subject", "subjectName subjectCode")
        .sort({ attendanceTime: -1 })
        .limit(5);

    return {
        totalClasses,
        presentClasses,
        absentClasses,
        attendancePercentage,
        recentAttendance,
    };
};