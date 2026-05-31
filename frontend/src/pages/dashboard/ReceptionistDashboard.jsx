import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiUsers, FiCheckCircle, FiClock, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";
import StatCard from "../../components/dashboard/StatCard";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    appointmentService.getAll({ date: today })
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const scheduled = appointments.filter((a) => a.status === "scheduled");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  const cards = [
    { title: "Today's Total", value: appointments.length, icon: FiCalendar, color: "blue", subtitle: "All appointments" },
    { title: "Scheduled", value: scheduled.length, icon: FiClock, color: "violet", subtitle: "Waiting to check-in" },
    { title: "Confirmed", value: confirmed.length, icon: FiCheckCircle, color: "green", subtitle: "Checked in" },
    { title: "Completed", value: completed.length, icon: FiUsers, color: "coral", subtitle: "Done today" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.fullName?.split(" ")[0]}! 📋`}
        subtitle="Manage today's appointment queue and patient check-ins."
        actions={
          <Link to="/receptionist/register-patient" className="btn btn-primary">
            <FiPlusCircle size={15} /> Register Patient
          </Link>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        {cards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Today's Queue */}
      <motion.div className="section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="section-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-receptionist)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiCalendar size={17} color="white" />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Today's Appointment Queue</h3>
          </div>
          <Link to="/receptionist/appointments" className="btn btn-ghost btn-sm">View All</Link>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            No appointments scheduled for today
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 10).map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: 11, background: "var(--gradient-primary)" }}>
                        {apt.patient?.fullName?.[0] || "P"}
                      </div>
                      {apt.patient?.fullName || "—"}
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>Dr. {apt.doctor?.fullName?.split(" ").slice(-1)[0] || "—"}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{apt.time}</td>
                  <td><Badge status={apt.type} /></td>
                  <td><Badge status={apt.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default ReceptionistDashboard;
