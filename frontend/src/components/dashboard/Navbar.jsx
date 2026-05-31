import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSearch, FiLogOut, FiUser, FiChevronDown, FiCheck } from "react-icons/fi";

const roleColors = {
  admin: "var(--gradient-admin)",
  doctor: "var(--gradient-doctor)",
  patient: "var(--gradient-patient)",
  receptionist: "var(--gradient-receptionist)",
};

const mockNotifications = {
  admin: [
    { id: 1, title: "Database Backup Completed", time: "5 mins ago", description: "System backup finished with no errors.", type: "info" },
    { id: 2, title: "New Doctor Registered", time: "1 hour ago", description: "Dr. Gregory House has been added.", type: "success" },
    { id: 3, title: "High CPU Usage Alert", time: "3 hours ago", description: "Server load hit 87% briefly.", type: "warning" },
  ],
  doctor: [
    { id: 1, title: "Appointment Checked In", time: "2 mins ago", description: "Patient John Doe has arrived at the reception.", type: "success" },
    { id: 2, title: "New Appointment Booked", time: "2 hours ago", description: "Patient Sarah Smith has scheduled a follow-up.", type: "info" },
    { id: 3, title: "Lab Report Available", time: "1 day ago", description: "CBC results for patient James Miller are ready.", type: "info" },
  ],
  patient: [
    { id: 1, title: "New Invoice Generated", time: "10 mins ago", description: "Invoice INV-00004 for $150.00 is ready.", type: "warning" },
    { id: 2, title: "Prescription Added", time: "3 hours ago", description: "Dr. Carter uploaded prescription details.", type: "success" },
    { id: 3, title: "Appointment Confirmed", time: "1 day ago", description: "Your appointment for Monday is confirmed.", type: "success" },
  ],
  receptionist: [
    { id: 1, title: "New Appointment Booked", time: "4 mins ago", description: "Patient John Doe booked with Dr. Jenkins.", type: "info" },
    { id: 2, title: "Invoice Marked Paid", time: "25 mins ago", description: "Invoice INV-00003 paid in full via cash.", type: "success" },
    { id: 3, title: "Doctor Availability Updated", time: "2 hours ago", description: "Dr. Gregory House is active.", type: "info" },
  ],
};

const greetings = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = mockNotifications[user?.role || "patient"] || [];

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header className="navbar">
      {/* Search */}
      <div className="navbar-search">
        <FiSearch
          size={15}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
          }}
        />
        <input placeholder={`${greetings()}, ${user?.fullName?.split(" ")[0]}!`} readOnly style={{ cursor: "default" }} />
      </div>

      <div style={{ flex: 1 }} />

      {/* Notification Bell */}
      <div style={{ position: "relative" }}>
        <button
          className="icon-btn"
          style={{ position: "relative" }}
          onClick={() => {
            setNotificationsOpen((o) => !o);
            setDropdownOpen(false);
          }}
        >
          <FiBell size={17} />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--coral)",
                border: "1.5px solid var(--bg-secondary)",
              }}
            />
          )}
        </button>

        {notificationsOpen && (
          <div
            className="glass-card"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 320,
              padding: "16px 0",
              boxShadow: "var(--shadow-lg)",
              zIndex: 200,
              border: "1px solid var(--border)",
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 12px 16px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none", border: "none", color: "var(--blue-light)",
                    fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <FiCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "20px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No new notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.2s",
                      cursor: "pointer",
                      position: "relative",
                      background: unreadCount > 0 ? "rgba(255,255,255,0.01)" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = unreadCount > 0 ? "rgba(255,255,255,0.01)" : "none")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: n.type === "warning" ? "var(--coral-light)" : n.type === "success" ? "var(--emerald-light)" : "var(--text-primary)",
                        }}
                      >
                        {n.title}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                      {n.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ width: 14 }} />

      {/* User Dropdown */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => {
            setDropdownOpen((o) => !o);
            setNotificationsOpen(false);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "6px 12px 6px 6px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <div
            className="avatar-placeholder"
            style={{
              width: 30,
              height: 30,
              fontSize: 12,
              background: roleColors[user?.role] || "var(--gradient-primary)",
            }}
          >
            {initials}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
              {user?.fullName?.split(" ")[0]}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>
              {user?.role}
            </div>
          </div>
          <FiChevronDown
            size={14}
            style={{
              color: "var(--text-muted)",
              transition: "transform 0.2s",
              transform: dropdownOpen ? "rotate(180deg)" : "none",
            }}
          />
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              minWidth: 180,
              boxShadow: "var(--shadow-lg)",
              zIndex: 200,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => { setDropdownOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "12px 16px",
                background: "none", border: "none",
                color: "var(--text-secondary)", cursor: "pointer",
                fontSize: 13.5, transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <FiUser size={15} /> Profile
            </button>
            <div style={{ height: 1, background: "var(--border)" }} />
            <button
              onClick={handleLogout}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "12px 16px",
                background: "none", border: "none",
                color: "var(--coral-light)", cursor: "pointer",
                fontSize: 13.5, transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <FiLogOut size={15} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
