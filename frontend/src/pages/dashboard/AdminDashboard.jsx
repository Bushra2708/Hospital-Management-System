import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiUserCheck, FiCalendar, FiDollarSign, FiActivity, FiClock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/departmentService";
import StatCard from "../../components/dashboard/StatCard";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {
        // Use placeholder data for demo
        setStats({
          totalDoctors: 24,
          totalPatients: 1248,
          totalAppointments: 843,
          todayAppointments: 18,
          pendingAppointments: 43,
          completedAppointments: 720,
          totalRevenue: 184500,
          recentAppointments: [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: "Total Doctors", value: stats?.totalDoctors ?? 0, icon: FiUserCheck, color: "blue", subtitle: "Active medical staff" },
    { title: "Total Patients", value: stats?.totalPatients ?? 0, icon: FiUsers, color: "green", subtitle: "Registered patients" },
    { title: "Appointments", value: stats?.totalAppointments ?? 0, icon: FiCalendar, color: "violet", subtitle: `${stats?.todayAppointments ?? 0} today` },
    { title: "Revenue", value: stats?.totalRevenue ?? 0, icon: FiDollarSign, color: "coral", prefix: "$", subtitle: "Total earnings" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(" ")[0]}! 👋`}
        subtitle="Here's what's happening at MediCare today."
      />

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        {cards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Appointment Summary */}
        <motion.div
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiActivity size={17} color="white" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Appointment Overview</h3>
            </div>
          </div>

          {[
            { label: "Scheduled", value: stats?.pendingAppointments ?? 43, color: "var(--blue)", width: "35%" },
            { label: "Completed", value: stats?.completedAppointments ?? 720, color: "var(--emerald)", width: "82%" },
            { label: "Today", value: stats?.todayAppointments ?? 18, color: "var(--violet)", width: "15%" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "var(--border)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: item.color, borderRadius: 999 }}
                  initial={{ width: 0 }}
                  animate={{ width: item.width }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Appointments */}
        <motion.div
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="section-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiClock size={17} color="white" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Activity</h3>
            </div>
          </div>

          {stats?.recentAppointments?.length > 0 ? (
            stats.recentAppointments.map((apt) => (
              <div
                key={apt._id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderBottom: "1px solid var(--border)",
                }}
              >
                <div className="avatar-placeholder" style={{ width: 34, height: 34, fontSize: 12, background: "var(--gradient-primary)" }}>
                  {apt.patient?.fullName?.[0] || "P"}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {apt.patient?.fullName || "Patient"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                    {formatDate(apt.date)} · Dr. {apt.doctor?.fullName?.split(" ").slice(-1)[0]}
                  </div>
                </div>
                <Badge status={apt.status} />
              </div>
            ))
          ) : (
            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No recent appointments
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { label: "Pending Appointments", value: stats?.pendingAppointments ?? 43, color: "var(--amber)" },
          { label: "Completed Today", value: stats?.completedAppointments ?? 720, color: "var(--emerald)" },
          { label: "Today's Appointments", value: stats?.todayAppointments ?? 18, color: "var(--blue)" },
        ].map((item) => (
          <div
            key={item.label}
            className="glass-card"
            style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 6 }}
          >
            <span style={{ fontSize: 11.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {item.label}
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: item.color, fontFamily: "Poppins, sans-serif" }}>
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;