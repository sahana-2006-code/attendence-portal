export const facultyDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Faculty Dashboard",
    user: req.user,
  });
};

export const studentDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Student Dashboard",
    user: req.user,
  });
};