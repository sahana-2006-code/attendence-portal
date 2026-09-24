import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authenticate = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Access token is required", 401));
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is allowed
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to perform this action", 403)
      );
    }

    next();
  };
};
export default authenticate;