import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <button type="button" className="logout-button" onClick={handleLogout}>
      <span>↪</span>
      Sign out
    </button>
  );
};

export default LogoutButton;
