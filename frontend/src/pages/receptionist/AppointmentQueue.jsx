import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";
import { appointmentService } from "../../services/appointmentService";
import DataTable from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const AppointmentQueue = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [detailApt, setDetailApt] = useState(null);

  const fetch = () => {
    setLoading(true);
    appointmentService
      .getAll({ date: selectedDate })
      .then((r) => setAppointments(r.data.data || []))
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [selectedDate]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      toast.success(`Marked as ${status}`);
      fetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const counts = {
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const columns = [
    {
      key: "time",
      label: "Time",
      render: (r) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: "var(--blue-light)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {r.time}
        </span>
      ),
    },
    {
      key: "patient",
      label: "Patient",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            className="avatar-placeholder"
            style={{ width: 32, height: 32, fontSize: 12, background: "var(--gradient-primary)" }}
          >
            {r.patient?.fullName?.[0] || "P"}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{r.patient?.fullName || "—"}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
              {r.patient?.phone || r.patient?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (r) => (
        <span style={{ color: "var(--text-secondary)" }}>
          Dr. {r.doctor?.fullName?.split(" ").slice(-1)[0] || "—"}
        </span>
      ),
    },
    { key: "type", label: "Type", render: (r) => <Badge status={r.type} /> },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Appointment Queue"
        subtitle="Manage daily check-ins and patient flow"
        actions={
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="date"
              className="form-input"
              style={{ width: 160 }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="icon-btn" onClick={fetch} title="Refresh">
              <FiRefreshCw size={15} />
            </button>
          </div>
        }
      />

      {/* Status Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          { label: "Scheduled", count: counts.scheduled, color: "var(--blue)", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
          { label: "Confirmed", count: counts.confirmed, color: "var(--emerald)", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
          { label: "Completed", count: counts.completed, color: "var(--violet)", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
          { label: "Cancelled", count: counts.cancelled, color: "var(--coral)", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              background: item.bg,
              border: `1px solid ${item.border}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: item.color,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {item.count}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          searchable={true}
          emptyMessage={`No appointments for ${new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`}
          actions={(row) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDetailApt(row)}
              >
                View
              </button>
              {row.status === "scheduled" && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleStatusUpdate(row._id, "confirmed")}
                >
                  Check In
                </button>
              )}
              {row.status === "confirmed" && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStatusUpdate(row._id, "completed")}
                >
                  Complete
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
              ["Patient", detailApt.patient?.fullName],
              ["Phone", detailApt.patient?.phone || "—"],
              ["Doctor", `Dr. ${detailApt.doctor?.fullName}`],
              ["Date", formatDate(detailApt.date)],
              ["Time", detailApt.time],
              ["Type", detailApt.type],
              ["Symptoms", detailApt.symptoms || "—"],
              ["Notes", detailApt.notes || "—"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    minWidth: 90,
                    paddingTop: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 13.5, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}

            <div>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Update Status
              </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["scheduled", "confirmed", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${detailApt.status === s ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => {
                      handleStatusUpdate(detailApt._id, s);
                      setDetailApt(null);
                    }}
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
    </div>
  );
};

export default AppointmentQueue;
