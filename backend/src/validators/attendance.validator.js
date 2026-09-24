import { body, validationResult } from "express-validator";

export const markAttendanceValidation = [

    body("qrToken")
        .notEmpty()
        .withMessage("QR Token is required"),

    body("latitude")
        .notEmpty()
        .withMessage("Latitude is required")
        .isFloat({
            min: -90,
            max: 90,
        })
        .withMessage("Invalid latitude"),

    body("longitude")
        .notEmpty()
        .withMessage("Longitude is required")
        .isFloat({
            min: -180,
            max: 180,
        })
        .withMessage("Invalid longitude"),

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