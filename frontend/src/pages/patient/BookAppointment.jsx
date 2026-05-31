import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";
import { doctorService } from "../../services/doctorService";
import { appointmentService } from "../../services/appointmentService";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", type: "consultation", symptoms: "" });
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    doctorService.getAll()
      .then((r) => setDoctors(r.data.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleBook = async () => {
    if (!selected || !form.date || !form.time) {
      toast.error("Please select doctor, date, and time");
      return;
    }
    setBooking(true);
    try {
      await appointmentService.book({ doctor: selected._id, ...form });
      toast.success("Appointment booked successfully! 🎉");
      navigate("/patient/appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally { setBooking(false); }
  };

  const specialties = [...new Set(doctors.map((d) => d.profile?.specialty).filter(Boolean))];
  const [filterSpec, setFilterSpec] = useState("all");
  const filtered = filterSpec === "all" ? doctors : doctors.filter((d) => d.profile?.specialty === filterSpec);

  return (
    <div>
      <PageHeader title="Book Appointment" subtitle="Find a doctor and schedule your visit" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
        {/* Doctor List */}
        <div>
          {/* Specialty Filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {["all", ...specialties].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSpec(s)}
                className={filterSpec === s ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"}
                style={{ textTransform: "capitalize" }}
              >
                {s === "all" ? "All Specialties" : s}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><LoadingSpinner /></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>No doctors found</div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {filtered.map((doc, idx) => (
                <motion.div
                  key={doc._id}
                  className="glass-card"
                  style={{
                    padding: 20,
                    cursor: "pointer",
                    border: selected?._id === doc._id ? "1.5px solid var(--blue)" : "1px solid var(--border)",
                    background: selected?._id === doc._id ? "rgba(59,130,246,0.08)" : "var(--bg-card)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelected(doc)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      className="avatar-placeholder"
                      style={{ width: 52, height: 52, fontSize: 20, background: "var(--gradient-doctor)", flexShrink: 0 }}
                    >
                      👨‍⚕️
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{doc.fullName}</div>
                      <div style={{ fontSize: 13, color: "var(--blue-light)", marginTop: 2 }}>{doc.profile?.specialty}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                        {doc.profile?.qualification} · {doc.profile?.experience || 0} yrs exp
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--emerald-light)" }}>
                        ${doc.profile?.consultationFee || 0}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>per visit</div>
                      {doc.profile?.isAvailable !== false && (
                        <span className="badge badge-green" style={{ marginTop: 6, display: "inline-flex" }}>Available</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Panel */}
        <div style={{ position: "sticky", top: 90 }}>
          <div className="section-card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
              {selected ? `Book with Dr. ${selected.fullName.split(" ").slice(-1)[0]}` : "Select a Doctor"}
            </h3>

            {!selected ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13 }}>
                ← Click a doctor to continue
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Selected Doctor */}
                <div style={{ padding: "12px 14px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 14, background: "var(--gradient-doctor)" }}>👨‍⚕️</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{selected.fullName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.profile?.specialty}</div>
                  </div>
                </div>

                {/* Date */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label"><FiCalendar size={12} style={{ marginRight: 4 }} />Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>

                {/* Time Slots */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label"><FiClock size={12} style={{ marginRight: 4 }} />Time Slot *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setForm((p) => ({ ...p, time: t }))}
                        style={{
                          padding: "7px 4px",
                          borderRadius: 8,
                          border: `1px solid ${form.time === t ? "var(--blue)" : "var(--border)"}`,
                          background: form.time === t ? "rgba(59,130,246,0.15)" : "var(--bg-card)",
                          color: form.time === t ? "var(--blue-light)" : "var(--text-secondary)",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: form.time === t ? 600 : 400,
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Appointment Type</label>
                  <select className="form-input form-select" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                    {["consultation", "follow-up", "routine", "specialist"].map((t) => <option key={t} value={t} style={{ textTransform: "capitalize" }}>{t}</option>)}
                  </select>
                </div>

                {/* Symptoms */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Symptoms / Reason</label>
                  <textarea className="form-input" rows={2} placeholder="Describe your symptoms..." value={form.symptoms} onChange={(e) => setForm((p) => ({ ...p, symptoms: e.target.value }))} style={{ resize: "vertical" }} />
                </div>

                <button className="btn btn-primary btn-full" onClick={handleBook} disabled={booking}>
                  {booking ? <><LoadingSpinner size="sm" /> Booking...</> : <>Confirm Booking <FiArrowRight size={16} /></>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
