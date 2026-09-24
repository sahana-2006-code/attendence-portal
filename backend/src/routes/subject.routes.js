import express from "express";

import authenticate, {
  authorize,
} from "../middlewares/auth.middleware.js";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/subject.controller.js";

import {
  createSubjectValidation,
  validateRequest,
} from "../validators/subject.validator.js";

const router = express.Router();

// Create Subject
router.post(
  "/",
  authenticate,
  authorize("faculty"),
  createSubjectValidation,
  validateRequest,
  create
);

// Get All Subjects
router.get(
  "/",
  authenticate,
  authorize("faculty"),
  getAll
);

// Get Subject By ID
router.get(
  "/:id",
  authenticate,
 authorize("faculty"),
  getById
);

// Update Subject
router.put(
  "/:id",
  authenticate,
  authorize("faculty"),
  createSubjectValidation,
  validateRequest,
  update
);

// Delete Subject (Soft Delete)
router.delete(
  "/:id",
  authenticate,
  authorize("faculty"),
  remove
);

export default router;