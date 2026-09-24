import { Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return <AppLayout user={user}>{children}</AppLayout>;
};

export default ProtectedRoute;
