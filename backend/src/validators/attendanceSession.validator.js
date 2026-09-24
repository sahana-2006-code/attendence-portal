import { body, validationResult } from "express-validator";

export const startAttendanceValidation = [
  body("subjectId")
    .notEmpty()
    .withMessage("Subject ID is required")
    .isMongoId()
    .withMessage("Invalid Subject ID"),

  body("campusLatitude")
    .notEmpty()
    .withMessage("Campus latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("campusLongitude")
    .notEmpty()
    .withMessage("Campus longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("campusRadius")
    .notEmpty()
    .withMessage("Campus radius is required")
    .isFloat({ min: 1 })
    .withMessage("Campus radius must be greater than 0")
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  next();
};