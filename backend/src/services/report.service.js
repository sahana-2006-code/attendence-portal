import Attendance from "../models/Attendance.js";
import AttendanceSession from "../models/AttendanceSession.js";
import Subject from "../models/Subject.js";
import { Parser } from "json2csv";
/*
---------------------------------------------------
Subject Report
---------------------------------------------------
*/
import ExcelJS from "exceljs";
/*
---------------------------------------------------
Export Subject Report as Excel
---------------------------------------------------
*/

export const exportSubjectReportExcel = async (
    subjectId,
    facultyId
) => {

    // Check whether the subject belongs to the logged-in faculty
    const subject = await Subject.findOne({
        _id: subjectId,
        faculty: facultyId,
        isActive: true,
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    // Fetch attendance records
    const attendance = await Attendance.find({
        subject: subjectId,
    })
        .populate(
            "student",
            "name rollNumber email department section"
        )
        .sort({
            attendanceTime: 1,
        });

    // Create Excel Workbook
    const workbook = new ExcelJS.Workbook();

    // Create Worksheet
    const worksheet = workbook.addWorksheet("Attendance Report");

    // Add Header Row
    worksheet.columns = [
        { header: "Student Name", key: "studentName", width: 25 },
        { header: "Roll Number", key: "rollNumber", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Department", key: "department", width: 20 },
        { header: "Section", key: "section", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Attendance Time", key: "attendanceTime", width: 30 },
    ];

    // Add Data Rows
    attendance.forEach((record) => {
        worksheet.addRow({
            studentName: record.student.name,
            rollNumber: record.student.rollNumber,
            email: record.student.email,
            department: record.student.department,
            section: record.student.section,
            status: record.status,
            attendanceTime: record.attendanceTime,
        });
    });

    // Make Header Bold
    worksheet.getRow(1).font = {
        bold: true,
    };

    return workbook;
};
export const getSubjectReport = async (subjectId, facultyId,page = 1,
    limit = 10) => {

    // Check subject exists and belongs to faculty
    const subject = await Subject.findOne({
        _id: subjectId,
        faculty: facultyId,
        isActive: true,
    });

    if (!subject) {
        throw new Error("Subject not found");
    }
const skip = (page - 1) * limit;
    // Total sessions conducted
    const totalSessions = await AttendanceSession.countDocuments({
        subject: subjectId,
    });

    // Total attendance records
    const totalStudentsPresent = await Attendance.countDocuments({
        subject: subjectId,
        status: "Present",
    });

    // Unique students
    const uniqueStudents = await Attendance.distinct(
        "student",
        {
            subject: subjectId,
        }
    );

    const attendancePercentage =
        totalSessions === 0 || uniqueStudents.length === 0
            ? 0
            : Number(
                  (
                      (totalStudentsPresent /
                          (totalSessions * uniqueStudents.length)) *
                      100
                  ).toFixed(2)
              );

    return {
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        totalSessions,
        totalStudentsPresent,
        totalStudents: uniqueStudents.length,
        attendancePercentage,
    };
};

/*
---------------------------------------------------
Session Report
---------------------------------------------------
*/

export const getSessionReport = async (sessionId, facultyId ,page = 1,
    limit = 10,search="",status = "",startDate = "",
    endDate = "") => {

    const session = await AttendanceSession.findOne({
        _id: sessionId,
        faculty: facultyId,
    }).populate("subject", "subjectName subjectCode");

    if (!session) {
        throw new Error("Attendance session not found");
    }
    // Validate page number
if (page < 1) {
    throw new Error("Page number must be greater than or equal to 1");
}

// Validate limit
if (limit < 1) {
    throw new Error("Limit must be greater than 0");
}

// Validate status
if (status && !["Present", "Absent"].includes(status)) {
    throw new Error(
        "Status must be either 'Present' or 'Absent'"
    );
}

// Validate date format
if (startDate && isNaN(new Date(startDate).getTime())) {
    throw new Error("Invalid start date");
}

if (endDate && isNaN(new Date(endDate).getTime())) {
    throw new Error("Invalid end date");
}

// Validate date range
if (
    startDate &&
    endDate &&
    new Date(startDate) > new Date(endDate)
) {
    throw new Error(
        "Start date cannot be greater than end date"
    );
}
const skip = (page - 1) * limit;
const query = {
    session: sessionId,
};

if (status) {
    query.status = status;
}

if (startDate && endDate) {
    query.attendanceTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
    };
}
  const attendance = await Attendance.find(query)
    .populate({
        path: "student",
        select: "name rollNumber email department section",
        match: search
            ? {
                  $or: [
                      {
                          name: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                      {
                          rollNumber: {
                              $regex: search,
                              $options: "i",
                          },
                      },
                  ],
              }
            : {},
    })
    .sort({
        attendanceTime: 1,
    })
    .skip(skip)
    .limit(limit);
    const filteredAttendance = attendance.filter(
    (record) => record.student !== null
);
    const totalRecords = await Attendance.countDocuments(query);
    return {
    session,
    totalRecords,
    currentPage: Number(page),
    totalPages: Math.ceil(totalRecords / limit),
    recordsPerPage: Number(limit),
    attendance: filteredAttendance,
};
};

/*
---------------------------------------------------
Student Report
---------------------------------------------------
*/

export const getStudentReport = async (
    studentId,
    facultyId,
    page = 1,
    limit = 10
) => {
   const skip = (page - 1) * limit;
    const attendance = await Attendance.find({
        student: studentId,
        faculty: facultyId,
    })
        .populate(
            "subject",
            "subjectName subjectCode"
        )
        .sort({
            attendanceTime: -1,
        })
        .skip(skip)
.limit(limit);
const totalRecords = await Attendance.countDocuments({
    student: studentId,
    faculty: facultyId,
});
    const totalClasses = totalRecords;

    const presentClasses = attendance.filter(
        item => item.status === "Present"
    ).length;

    const attendancePercentage =
        totalClasses === 0
            ? 0
            : Number(
                  (
                      (presentClasses / totalClasses) *
                      100
                  ).toFixed(2)
              );

    return {
    totalClasses,
    presentClasses,
    absentClasses:
        totalClasses - presentClasses,
    attendancePercentage,

    totalRecords,
    currentPage: Number(page),
    totalPages: Math.ceil(totalRecords / limit),
    recordsPerPage: Number(limit),

    attendance,
};
};
/*
---------------------------------------------------
Export Subject Report as CSV
---------------------------------------------------
*/

export const exportSubjectReportCSV = async (
    subjectId,
    facultyId
) => {

    // Check subject belongs to faculty
    const subject = await Subject.findOne({
        _id: subjectId,
        faculty: facultyId,
        isActive: true,
    });

    if (!subject) {
        throw new Error("Subject not found");
    }

    // Get attendance records
    const attendance = await Attendance.find({
        subject: subjectId,
    })
        .populate(
            "student",
            "name rollNumber email department section"
        )
        .sort({
            attendanceTime: 1,
        });

    // Convert records into plain objects
    const report = attendance.map((record) => ({
        StudentName: record.student.name,
        RollNumber: record.student.rollNumber,
        Email: record.student.email,
        Department: record.student.department,
        Section: record.student.section,
        Status: record.status,
        AttendanceTime: record.attendanceTime,
    }));

    // Define CSV columns
    const fields = [
        "StudentName",
        "RollNumber",
        "Email",
        "Department",
        "Section",
        "Status",
        "AttendanceTime",
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(report);

    return csv;
};