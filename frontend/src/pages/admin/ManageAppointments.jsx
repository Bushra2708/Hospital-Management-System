import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { appointmentService } from "../../services/appointmentService";
import { doctorService } from "../../services/doctorService";
import { patientService } from "../../services/patientService";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: "", doctor: "", date: "", time: "", type: "consultation", notes: "", symptoms: "" });

  const fetch = () => {
    setLoading(true);
    Promise.all([
      appointmentService.getAll(),
      doctorService.getAll(),
      patientService.getAll(),
    ]).then(([a, d, p]) => {
      setAppointments(a.data.data || []);
      setDoctors(d.data.data || []);
      setPatients(p.data.data || []);
    }).catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleBook = async () => {
    if (!form.patient || !form.doctor || !form.date || !form.time) {
      toast.error("Patient, doctor, date and time are required");
      return;
    }
    setSaving(true);
    try {
      await appointmentService.book(form);
      toast.success("Appointment booked");
      setModalOpen(false);
      setForm({ patient: "", doctor: "", date: "", time: "", type: "consultation", notes: "", symptoms: "" });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      toast.success("Status updated");
      setDetailId(null);
      fetch();
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async () => {
    try {
      await appointmentService.delete(deleteId);
      toast.success("Appointment deleted");
      setDeleteId(null);
      fetch();
    } catch { toast.error("Delete failed"); }
  };

  const detail = appointments.find((a) => a._id === detailId);

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  const columns = [
    {
      key: "patient", label: "Patient", sortable: false,
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: 11, background: "var(--gradient-primary)" }}>
            {r.patient?.fullName?.[0] || "P"}
          </div>
          <span style={{ fontWeight: 500 }}>{r.patient?.fullName || "—"}</span>
        </div>
      ),
    },
    { key: "doctor", label: "Doctor", render: (r) => <span style={{ color: "var(--text-secondary)" }}>Dr. {r.doctor?.fullName?.split(" ").slice(-1)[0] || "—"}</span> },
    { key: "date", label: "Date", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.date)}</span> },
    { key: "time", label: "Time", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.time}</span> },
    { key: "type", label: "Type", render: (r) => <Badge status={r.type} /> },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Appointments"
        subtitle={`${appointments.length} total appointments`}
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <FiPlus size={16} /> Book Appointment
          </button>
        }
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable
          columns={columns} data={appointments} loading={loading}
          emptyMessage="No appointments found."
          actions={(row) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button className="icon-btn" onClick={() => setDetailId(row._id)} title="View/Edit"><FiEdit2 size={14} /></button>
              <button className="icon-btn" onClick={() => setDeleteId(row._id)} style={{ color: "var(--coral-light)", borderColor: "rgba(244,63,94,0.2)" }}><FiTrash2 size={14} /></button>
            </div>
          )}
        />
      </motion.div>

      {/* Book Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment" size="lg"
        footer={<><button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleBook} disabled={saving}>{saving ? "Booking..." : "Book"}</button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Patient *</label>
            <select className="form-input form-select" value={form.patient} onChange={(e) => setForm((p) => ({ ...p, patient: e.target.value }))}>
              <option value="">Select Patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Doctor *</label>
            <select className="form-input form-select" value={form.doctor} onChange={(e) => setForm((p) => ({ ...p, doctor: e.target.value }))}>
              <option value="">Select Doctor</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.fullName} - {d.profile?.specialty}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date *</label>
            <input type="date" className="form-input" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Time *</label>
            <select className="form-input form-select" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}>
              <option value="">Select Time</option>
              {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Type</label>
            <select className="form-input form-select" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {["consultation", "follow-up", "emergency", "routine", "specialist"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Symptoms</label>
            <input type="text" className="form-input" placeholder="Chief complaint..." value={form.symptoms} onChange={(e) => setForm((p) => ({ ...p, symptoms: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
        </div>
      </Modal>

      {/* Detail/Status Modal */}
      {detail && (
        <Modal isOpen={!!detailId} onClose={() => setDetailId(null)} title="Appointment Details">
          <div style={{ display: "grid", gap: 14 }}>
            {[
              ["Patient", detail.patient?.fullName],
              ["Doctor", `Dr. ${detail.doctor?.fullName}`],
              ["Date", formatDate(detail.date)],
              ["Time", detail.time],
              ["Type", detail.type],
              ["Symptoms", detail.symptoms || "—"],
              ["Notes", detail.notes || "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)", minWidth: 80 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
            <div>
              <span style={{ fontSize: 12.5, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Update Status</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["confirmed", "completed", "cancelled", "scheduled"].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${detail.status === s ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => handleStatusUpdate(detail._id, s)}
                    style={{ textTransform: "capitalize" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Appointment"
        footer={<><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></>}>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Are you sure you want to delete this appointment?</p>
      </Modal>
    </div>
  );
};

export default ManageAppointments;
