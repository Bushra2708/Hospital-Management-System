import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { appointmentService } from "../../services/appointmentService";
import DataTable from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const MyAppointmentsDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailApt, setDetailApt] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    appointmentService.getMyAppointments()
      .then((r) => setAppointments(r.data.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleComplete = async () => {
    setSaving(true);
    try {
      await appointmentService.update(detailApt._id, { status: "completed", prescription, diagnosis });
      toast.success("Appointment completed");
      setDetailApt(null);
      fetch();
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const openDetail = (apt) => {
    setDetailApt(apt);
    setPrescription(apt.prescription || "");
    setDiagnosis(apt.diagnosis || "");
  };

  const columns = [
    {
      key: "patient", label: "Patient",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12, background: "var(--gradient-patient)" }}>{r.patient?.fullName?.[0]}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{r.patient?.fullName}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{r.patient?.phone || r.patient?.email}</div>
          </div>
        </div>
      ),
    },
    { key: "date", label: "Date", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.date)}</span> },
    { key: "time", label: "Time", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.time}</span> },
    { key: "type", label: "Type", render: (r) => <Badge status={r.type} /> },
    { key: "symptoms", label: "Symptoms", render: (r) => <span style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{r.symptoms || "—"}</span> },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="My Appointments" subtitle={`${appointments.length} total appointments`} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable
          columns={columns} data={appointments} loading={loading}
          emptyMessage="No appointments found."
          actions={(row) => (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => openDetail(row)}
              disabled={row.status === "completed" || row.status === "cancelled"}
            >
              {row.status === "completed" ? "Done" : row.status === "cancelled" ? "Cancelled" : "Update"}
            </button>
          )}
        />
      </motion.div>

      {detailApt && (
        <Modal isOpen={!!detailApt} onClose={() => setDetailApt(null)} title="Update Appointment" size="md"
          footer={<><button className="btn btn-ghost" onClick={() => setDetailApt(null)}>Cancel</button><button className="btn btn-success" onClick={handleComplete} disabled={saving}>{saving ? "Saving..." : "Mark Complete"}</button></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px 16px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{detailApt.patient?.fullName}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{formatDate(detailApt.date)} at {detailApt.time}</div>
              {detailApt.symptoms && <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 6 }}>Symptoms: {detailApt.symptoms}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Diagnosis</label>
              <textarea className="form-input" rows={2} placeholder="Enter diagnosis..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} style={{ resize: "vertical" }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Prescription</label>
              <textarea className="form-input" rows={3} placeholder="Medications and instructions..." value={prescription} onChange={(e) => setPrescription(e.target.value)} style={{ resize: "vertical" }} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyAppointmentsDoctor;
