import express from "express";

import {
  startAttendance,
  endAttendance,
  generateQR,
  getSessions,
} from "../controllers/attendanceSession.controller.js";

import authenticate, {
  authorize,
} from "../middlewares/auth.middleware.js";

import {
  startAttendanceValidation,
  validateRequest,
} from "../validators/attendanceSession.validator.js";

const router = express.Router();
router.get(
    "/",
    authenticate,
    authorize("faculty"),
    getSessions
);
router.post(
  "/start",
  authenticate,
  authorize("faculty"),
  startAttendanceValidation,
  validateRequest,
  startAttendance
);

router.patch(
  "/:id/end",
  authenticate,
  authorize("faculty"),
  endAttendance
);
router.post(
    "/:id/generate-qr",
    authenticate,
    authorize("faculty"),
    generateQR
);
export default router;