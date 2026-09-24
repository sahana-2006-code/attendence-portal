import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Attendance Portal API is healthy",
    data: {
      status: "UP",
      timestamp: new Date(),
    },
  });
});

export default router;