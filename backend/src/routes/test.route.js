import express from "express";
import authenticate, { authorize } from "../middlewares/auth.middleware.js";
import {
  facultyDashboard,
  studentDashboard,
} from "../controllers/test.controller.js";

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