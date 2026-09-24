import {
    getSubjectReport,
    getSessionReport,
    getStudentReport,
    exportSubjectReportCSV,
    exportSubjectReportExcel
} from "../services/report.service.js";

// Faculty - Subject Report
export const subjectReport = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;

const report = await getSubjectReport(
    req.params.subjectId,
    req.user.id,
    page,
    limit
);

      return res.status(200).json(
            new ApiResponse(
                200,
                "Subject report fetched successfully",
                report
            )
        );

    } catch (error) {

        next(error);

    }

};

// Faculty - Session Report
export const sessionReport = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
         const status = req.query.status || "";
         const startDate = req.query.startDate || "";
        const endDate = req.query.endDate || "";
        const report = await getSessionReport(
            req.params.sessionId,
            req.user.id,
            page,
            limit,
            search,
            status,
              startDate,
            endDate
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Session report fetched successfully",
                report
            )
        );

    } catch (error) {

        next(error);

    }

};

// Faculty - Student Report
export const studentReport = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const report = await getStudentReport(
            req.params.studentId,
            req.user.id,
            page,
            limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Student report fetched successfully",
                report
            )
        );

    } catch (error) {

        next(error);

    }

};
/*
---------------------------------------------------
Export Subject Report as CSV
---------------------------------------------------
*/

export const exportCSV = async (req, res, next) => {

    try {

        const csv = await exportSubjectReportCSV(
            req.params.subjectId,
            req.user.id
        );

        // Tell browser/Postman this is a CSV file
        res.header("Content-Type", "text/csv");

        // Suggest a filename
        res.attachment("attendance-report.csv");

        // Send CSV data
        return res.status(200).send(csv);

    } catch (error) {

        next(error);

    }

};
/*
---------------------------------------------------
Export Subject Report as Excel
---------------------------------------------------
*/

export const exportExcel = async (req, res, next) => {

    try {

        const workbook = await exportSubjectReportExcel(
            req.params.subjectId,
            req.user.id
        );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=attendance-report.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        next(error);

    }

};