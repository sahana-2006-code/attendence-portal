import { body, validationResult } from "express-validator";

// Validation rules
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("role")
    .isIn(["student", "faculty"])
    .withMessage("Role must be either student or faculty"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .trim()
    .toUpperCase(),

  body("semester")
    .if(body("role").equals("student"))
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8")
    .toInt(),

  body("section")
    .if(body("role").equals("student"))
    .notEmpty()
    .withMessage("Section is required for students")
    .trim()
    .toUpperCase(),

  body("rollNumber")
    .if(body("role").equals("student"))
    .notEmpty()
    .withMessage("Roll Number is required for students"),

  body("employeeId")
    .if(body("role").equals("faculty"))
    .notEmpty()
    .withMessage("Employee ID is required for faculty"),
];
// Login Validation
export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];
// Middleware to check validation result
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