import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default : null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    campusLatitude: {
      type: Number,
      required: true,
    },

    campusLongitude: {
      type: Number,
      required: true,
    },

    campusRadius: {
      type: Number,
      default: 50,
    },

    qrToken: {
      type: String,
      default: null,
    },

    qrExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceSession = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema
);

export default AttendanceSession;