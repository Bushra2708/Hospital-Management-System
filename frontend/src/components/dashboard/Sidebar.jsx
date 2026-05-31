import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiGrid, FiUsers, FiUserCheck, FiCalendar,
  FiDollarSign, FiLayers, FiLogOut, FiActivity,
  FiUser, FiPlusCircle, FiList, FiClipboard,
} from "react-icons/fi";
import { FaHospital } from "react-icons/fa";

const navConfig = {
  admin: [
    { group: "Overview", items: [{ to: "/admin", icon: FiGrid, label: "Dashboard" }] },
    {
      group: "Management",
      items: [
        { to: "/admin/doctors", icon: FiUserCheck, label: "Doctors" },
        { to: "/admin/patients", icon: FiUsers, label: "Patients" },
        { to: "/admin/appointments", icon: FiCalendar, label: "Appointments" },
        { to: "/admin/billing", icon: FiDollarSign, label: "Billing" },
        { to: "/admin/departments", icon: FiLayers, label: "Departments" },
      ],
    },
  ],
  doctor: [
    { group: "Overview", items: [{ to: "/doctor", icon: FiGrid, label: "Dashboard" }] },
    {
      group: "My Work",
      items: [
        { to: "/doctor/appointments", icon: FiCalendar, label: "My Appointments" },
        { to: "/doctor/patients", icon: FiUsers, label: "My Patients" },
      ],
    },
  ],
  patient: [
    { group: "Overview", items: [{ to: "/patient", icon: FiGrid, label: "Dashboard" }] },
    {
      group: "My Health",
      items: [
        { to: "/patient/book", icon: FiPlusCircle, label: "Book Appointment" },
        { to: "/patient/appointments", icon: FiCalendar, label: "My Appointments" },
        { to: "/patient/bills", icon: FiDollarSign, label: "My Bills" },
      ],
    },
  ],
  receptionist: [
    { group: "Overview", items: [{ to: "/receptionist", icon: FiGrid, label: "Dashboard" }] },
    {
      group: "Operations",
      items: [
        { to: "/receptionist/appointments", icon: FiClipboard, label: "Appointment Queue" },
        { to: "/receptionist/register-patient", icon: FiPlusCircle, label: "Register Patient" },
        { to: "/receptionist/patients", icon: FiUsers, label: "Patients" },
        { to: "/receptionist/billing", icon: FiDollarSign, label: "Billing" },
      ],
    },
  ],
};

const roleGradients = {
  admin: "var(--gradient-admin)",
  doctor: "var(--gradient-doctor)",
  patient: "var(--gradient-patient)",
  receptionist: "var(--gradient-receptionist)",
};

const roleLabels = {
  admin: "Administrator",
  doctor: "Doctor",
  patient: "Patient",
  receptionist: "Receptionist",
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const groups = navConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FaHospital size={20} color="white" />
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
            MediCare HMS
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
            Hospital Management
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {groups.map((group) => (
          <div key={group.group} style={{ marginBottom: 8 }}>
            <div className="nav-group-label">{group.group}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin" || item.to === "/doctor" || item.to === "/patient" || item.to === "/receptionist"}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-item-icon">
                  <item.icon size={17} />
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div
        style={{
          padding: "16px 16px",
          borderTop: "1px solid var(--border)",
        }}
      >
        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 12,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            marginBottom: 8,
          }}
        >
          <div
            className="avatar-placeholder"
            style={{
              width: 34,
              height: 34,
              fontSize: 13,
              background: roleGradients[user?.role] || "var(--gradient-primary)",
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullName}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {roleLabels[user?.role]}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{
            width: "100%",
            background: "none",
            border: "none",
            color: "var(--coral-light)",
            cursor: "pointer",
          }}
        >
          <span className="nav-item-icon">
            <FiLogOut size={17} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;