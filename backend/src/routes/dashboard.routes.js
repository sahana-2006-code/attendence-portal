import express from "express";
import {
    studentDashboard
} from "../controllers/dashboard.controller.js";
import authenticate, {
    authorize,
} from "../middlewares/auth.middleware.js";

import {
    facultyDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
    "/faculty",
    authenticate,
    authorize("faculty"),
    facultyDashboard
);
router.get(
    "/student",
    authenticate,
    authorize("student"),
    studentDashboard
);

export default router;