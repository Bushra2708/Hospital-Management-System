import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCalendar, FiX } from "react-icons/fi";
import { appointmentService } from "../../services/appointmentService";
import DataTable from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const MyAppointmentsPatient = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [detailApt, setDetailApt] = useState(null);

  const fetch = () => {
    setLoading(true);
    appointmentService
      .getMyAppointments()
      .then((r) => setAppointments(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCancel = async () => {
    try {
      await appointmentService.cancel(cancelId, "Cancelled by patient");
      toast.success("Appointment cancelled");
      setCancelId(null);
      fetch();
    } catch {
      toast.error("Cancel failed");
    }
  };

  const columns = [
    {
      key: "doctor",
      label: "Doctor",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="avatar-placeholder"
            style={{ width: 34, height: 34, fontSize: 13, background: "var(--gradient-doctor)" }}
          >
            👨‍⚕️
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>Dr. {r.doctor?.fullName}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{r.doctor?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.date)}</span>,
    },
    {
      key: "time",
      label: "Time",
      render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.time}</span>,
    },
    { key: "type", label: "Type", render: (r) => <Badge status={r.type} /> },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
  ];

  const canCancel = (apt) =>
    apt.status === "scheduled" || apt.status === "confirmed";

  return (
    <div>
      <PageHeader
        title="My Appointments"
        subtitle={`${appointments.length} total appointments`}
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          emptyMessage="No appointments yet. Book your first appointment!"
          actions={(row) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDetailApt(row)}
              >
                Details
              </button>
              {canCancel(row) && (
                <button
                  className="icon-btn"
                  onClick={() => setCancelId(row._id)}
                  style={{ color: "var(--coral-light)", borderColor: "rgba(244,63,94,0.2)" }}
                  title="Cancel"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          )}
        />
      </motion.div>

      {/* Detail Modal */}
      {detailApt && (
        <Modal
          isOpen={!!detailApt}
          onClose={() => setDetailApt(null)}
          title="Appointment Details"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Doctor", `Dr. ${detailApt.doctor?.fullName}`],
              ["Date", formatDate(detailApt.date)],
              ["Time", detailApt.time],
              ["Type", detailApt.type],
              ["Status", detailApt.status],
              ["Symptoms", detailApt.symptoms || "—"],
              ["Diagnosis", detailApt.diagnosis || "—"],
              ["Prescription", detailApt.prescription || "—"],
              ["Notes", detailApt.notes || "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    minWidth: 100,
                    paddingTop: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 13.5, color: "var(--text-primary)", lineHeight: 1.5, flex: 1 }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Cancel Confirm */}
      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Appointment"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setCancelId(null)}>
              Keep Appointment
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel Appointment
            </button>
          </>
        }
      >
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
          Are you sure you want to cancel this appointment? You can rebook anytime.
        </p>
      </Modal>
    </div>
  );
};

export default MyAppointmentsPatient;
