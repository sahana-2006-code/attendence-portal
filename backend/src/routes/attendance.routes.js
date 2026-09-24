import express from "express";

import authenticate, {
    authorize,
} from "../middlewares/auth.middleware.js";

import {
    mark,
    history,
    percentage,
    sessionReport,
} from "../controllers/attendance.controller.js";

import {
    markAttendanceValidation,
    validateRequest,
} from "../validators/attendance.validator.js";

const router = express.Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Attendance routes are working"
    });
});
// Student marks attendance
router.post(
    "/mark",
    authenticate,
    authorize("student"),
    markAttendanceValidation,
    validateRequest,
    mark
);

// Student attendance history
router.get(
    "/history",
    authenticate,
    authorize("student"),
    history
);

// Student attendance percentage
router.get(
    "/percentage",
    authenticate,
    authorize("student"),
    percentage
);

// Faculty session report
router.get(
    "/report/session/:sessionId",
    authenticate,
    authorize("faculty"),
    sessionReport
);

export default router;