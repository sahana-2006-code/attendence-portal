import express from "express";
import attendanceRoutes from "./attendance.routes.js";
import authRoutes from "./auth.route.js";
import testRoutes from "./test.route.js";
import subjectRoutes from "./subject.routes.js";
import attendanceSessionRoutes from "./attendanceSession.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import reportRoutes from "./report.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/subjects", subjectRoutes);
router.use("/attendance-sessions", attendanceSessionRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/reports", reportRoutes);
router.use("/dashboard", dashboardRoutes);
export default router;