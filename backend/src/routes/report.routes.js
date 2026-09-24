import express from "express";

import authenticate, {
    authorize,
} from "../middlewares/auth.middleware.js";

import {
    subjectReport,
    sessionReport,
    studentReport,
    exportCSV,
    exportExcel,
} from "../controllers/report.controller.js";

const router = express.Router();

// Get Subject Report
router.get(
    "/subject/:subjectId",
    authenticate,
    authorize("faculty"),
    subjectReport
);

// Get Session Report
router.get(
    "/session/:sessionId",
    authenticate,
    authorize("faculty"),
    sessionReport
);

// Get Student Report
router.get(
    "/student/:studentId",
    authenticate,
    authorize("faculty"),
    studentReport
);
router.get(
    "/export/csv/:subjectId",
    authenticate,
    authorize("faculty"),
    exportCSV
);
/*
---------------------------------------------------
Export Subject Report as Excel
---------------------------------------------------
*/

router.get(
    "/export/excel/:subjectId",
    authenticate,
    authorize("faculty"),
    exportExcel
);
export default router;