import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["student", "faculty"],
      required: true,
    },

    rollNumber: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },

    employeeId: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    semester: {
  type: Number,
  required: function () {
    return this.role === "student";
  },
  min: [1, "Semester cannot be less than 1"],
  max: [8, "Semester cannot be greater than 8"],
},

section: {
  type: String,
  required: function () {
    return this.role === "student";
  },
  trim: true,
  uppercase: true,
},
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;