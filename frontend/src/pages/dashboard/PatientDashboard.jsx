import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiDollarSign, FiClock, FiPlusCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";
import { billingService } from "../../services/billingService";
import StatCard from "../../components/dashboard/StatCard";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentService.getMyAppointments().then((r) => r.data.data || []),
      billingService.getMyBills().then((r) => r.data.data || []).catch(() => []),
    ])
      .then(([apts, bls]) => { setAppointments(apts); setBills(bls); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => new Date(a.date) >= new Date() && a.status !== "cancelled");
  const pendingBills = bills.filter((b) => b.status === "pending");
  const totalOwed = pendingBills.reduce((s, b) => s + b.totalAmount, 0);

  const cards = [
    { title: "Upcoming Appointments", value: upcoming.length, icon: FiCalendar, color: "blue", subtitle: "Scheduled visits" },
    { title: "Total Appointments", value: appointments.length, icon: FiClock, color: "green", subtitle: "All time visits" },
    { title: "Pending Bills", value: pendingBills.length, icon: FiDollarSign, color: "coral", subtitle: `$${totalOwed.toFixed(2)} owed` },
    { title: "Medical Bills", value: bills.length, icon: FiDollarSign, color: "violet", subtitle: "Total invoices" },
  ];

  return (
    <div>
      <PageHeader
        title={`Hello, ${user?.fullName?.split(" ")[0]}! 🌟`}
        subtitle="Your health at a glance — stay on top of your appointments and bills."
        actions={
          <Link to="/patient/book" className="btn btn-primary">
            <FiPlusCircle size={15} /> Book Appointment
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Upcoming Appointments */}
        <motion.div className="section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="section-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-patient)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiCalendar size={17} color="white" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Upcoming Appointments</h3>
            </div>
            <Link to="/patient/appointments" style={{ fontSize: 12, color: "var(--blue-light)", textDecoration: "none" }}>View All</Link>
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
          ) : upcoming.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>No upcoming appointments</p>
              <Link to="/patient/book" className="btn btn-primary btn-sm">Book Now</Link>
            </div>
          ) : (
            upcoming.slice(0, 4).map((apt) => (
              <div key={apt._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "var(--gradient-doctor)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "white", flexShrink: 0,
                  }}
                >
                  👨‍⚕️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Dr. {apt.doctor?.fullName}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{formatDate(apt.date)} at {apt.time}</div>
                </div>
                <Badge status={apt.type} />
              </div>
            ))
          )}
        </motion.div>

        {/* Bills */}
        <motion.div className="section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="section-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gradient-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FiDollarSign size={17} color="white" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Bills</h3>
            </div>
            <Link to="/patient/bills" style={{ fontSize: 12, color: "var(--blue-light)", textDecoration: "none" }}>View All</Link>
          </div>

          {bills.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No billing records
            </div>
          ) : (
            bills.slice(0, 4).map((bill) => (
              <div key={bill._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{bill.invoiceNumber}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{formatDate(bill.createdAt)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>${bill.totalAmount?.toFixed(2)}</div>
                  <Badge status={bill.status} />
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
