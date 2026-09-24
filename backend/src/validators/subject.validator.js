import { body, validationResult } from "express-validator";

export const createSubjectValidation = [
  body("subjectName")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required"),

  body("subjectCode")
    .trim()
    .notEmpty()
    .withMessage("Subject code is required"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .toUpperCase(),

  body("semester")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8")
    .toInt(),

  body("section")
    .trim()
    .notEmpty()
    .withMessage("Section is required")
    .toUpperCase(),

  body("academicYear")
    .trim()
    .notEmpty()
    .withMessage("Academic year is required"),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};