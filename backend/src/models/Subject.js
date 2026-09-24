import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      minlength: [2, "Subject name must be at least 2 characters"],
      maxlength: [100, "Subject name cannot exceed 100 characters"],
    },

    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      uppercase: true,
      enum: {
        values: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
        message: "Invalid department",
      },
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester cannot be less than 1"],
      max: [8, "Semester cannot be greater than 8"],
    },

    section: {
      type: String,
      required: [true, "Section is required"],
      uppercase: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty is required"],
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

// Indexes
subjectSchema.index({ faculty: 1 });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;