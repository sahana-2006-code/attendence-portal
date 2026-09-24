import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
export const registerUser = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    rollNumber,
    employeeId,
    department,
    semester,
    section,
  } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  // Check duplicate roll number (for students)
  if (role === "student") {
    const existingStudent = await User.findOne({ rollNumber });

    if (existingStudent) {
      throw new AppError("Roll Number already exists", 409);
    }
  }

  // Check duplicate employee ID (for faculty)
  if (role === "faculty") {
    const existingFaculty = await User.findOne({ employeeId });

    if (existingFaculty) {
      throw new AppError("Employee ID already exists", 409);
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    rollNumber,
    employeeId,
    department: department
      ? String(department).trim().toUpperCase()
      : department,
    semester:
      role === "student" ? Number(semester) : undefined,
    section:
      role === "student"
        ? String(section).trim().toUpperCase()
        : undefined,
  });

  // Convert to plain object
  const userObject = user.toObject();

  // Remove password before returning
  delete userObject.password;

  return userObject;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate JWT
  const token = generateToken(user);

  // Remove password before sending response
  const userObject = user.toObject();
  delete userObject.password;

  return {
    token,
    user: userObject,
  };
};