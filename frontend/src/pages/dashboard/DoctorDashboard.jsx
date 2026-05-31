import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";
import StatCard from "../../components/dashboard/StatCard";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService.getMyAppointments()
      .then((res) => setAppointments(res.data.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayApts = appointments.filter((a) => {
    const d = new Date(a.date);
    return d >= today && d < tomorrow;
  });
  const upcoming = appointments.filter((a) => new Date(a.date) >= tomorrow && a.status === "scheduled");
  const completed = appointments.filter((a) => a.status === "completed");
  const uniquePatients = [...new Set(appointments.map((a) => a.patient?._id).filter(Boolean))];

  const cards = [
    { title: "Today's Patients", value: todayApts.length, icon: FiCalendar, color: "blue", subtitle: "Appointments today" },
    { title: "Upcoming", value: upcoming.length, icon: FiClock, color: "violet", subtitle: "Scheduled appointments" },
    { title: "Completed", value: completed.length, icon: FiCheckCircle, color: "green", subtitle: "Total consultations" },
    { title: "My Patients", value: uniquePatients.length, icon: FiUsers, color: "coral", subtitle: "Unique patients seen" },
  ];

  return (
    <div>
      <PageHeader
        title={`Good day, Dr. ${user?.fullName?.split(" ").slice(-1)[0]}! 🩺`}
        subtitle="Your schedule and patient overview for today."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        {cards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Today's Schedule */}
        <motion.div className="section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="section-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-doctor)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiCalendar size={17} color="white" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Today's Schedule</h3>
            </div>
            <span className="badge badge-blue">{todayApts.length} appointments</span>
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
          ) : todayApts.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              🎉 No appointments today — enjoy your day!
            </div>
          ) : (
            todayApts.slice(0, 6).map((apt) => (
              <div key={apt._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div
                  style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: "var(--gradient-primary)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 16, color: "white", fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {apt.patient?.fullName?.[0] || "P"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{apt.patient?.fullName || "Patient"}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{apt.time} · {apt.type}</div>
                </div>
                <Badge status={apt.status} />
              </div>
            ))
          )}
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div className="section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="section-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiClock size={17} color="white" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Upcoming</h3>
            </div>
          </div>

          {upcoming.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No upcoming appointments
            </div>
          ) : (
            upcoming.slice(0, 5).map((apt) => (
              <div key={apt._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div className="avatar-placeholder" style={{ width: 34, height: 34, fontSize: 12, background: "var(--gradient-success)" }}>
                  {apt.patient?.fullName?.[0] || "P"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{apt.patient?.fullName}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{formatDate(apt.date)} · {apt.time}</div>
                </div>
                <Badge status={apt.type} />
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
