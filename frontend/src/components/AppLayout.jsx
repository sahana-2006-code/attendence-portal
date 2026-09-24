import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const studentNav = [
  { to: "/student/dashboard", label: "Dashboard", icon: "⌂" },
  { to: "/student/attendance", label: "Mark Attendance", icon: "▣" },
];

const facultyNav = [
  { to: "/faculty/dashboard", label: "Dashboard", icon: "⌂" },
  { to: "/faculty/subjects", label: "Subjects", icon: "▤" },
  { to: "/faculty/start-attendance", label: "Start Attendance", icon: "＋" },
  { to: "/faculty/attendance-report", label: "Reports", icon: "▥" },
];

const getInitials = (name = "User") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const AppLayout = ({ children, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = user?.role === "faculty" ? facultyNav : studentNav;

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate(user?.role === "faculty" ? "/faculty/dashboard" : "/student/dashboard")}>
          <div className="brand-mark">A</div>
          <div>
            <strong>Attendly</strong>
            <span>Campus Attendance</span>
          </div>
        </div>

        <div className="sidebar-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: linkActive }) =>
                `nav-item ${linkActive || isActive(item.to) ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">?</span>
            <div>
              <strong>Need help?</strong>
              <span>Contact your administrator</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">{user?.role === "faculty" ? "Faculty portal" : "Student portal"}</p>
            <p className="topbar-title">Attendance Management</p>
          </div>
          <div className="profile-chip">
            <div className="avatar">{getInitials(user?.name)}</div>
            <div className="profile-copy">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.role === "faculty" ? "Faculty" : user?.rollNumber || "Student"}</span>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={() => `mobile-nav-item ${isActive(item.to) ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
