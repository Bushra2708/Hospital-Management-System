import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { appointmentService } from "../../services/appointmentService";
import DataTable from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const MyPatients = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService.getMyAppointments()
      .then((r) => setAppointments(r.data.data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Get unique patients
  const patientMap = {};
  appointments.forEach((apt) => {
    if (apt.patient?._id && !patientMap[apt.patient._id]) {
      patientMap[apt.patient._id] = {
        ...apt.patient,
        lastVisit: apt.date,
        totalVisits: 1,
        lastStatus: apt.status,
      };
    } else if (apt.patient?._id) {
      patientMap[apt.patient._id].totalVisits++;
      if (new Date(apt.date) > new Date(patientMap[apt.patient._id].lastVisit)) {
        patientMap[apt.patient._id].lastVisit = apt.date;
        patientMap[apt.patient._id].lastStatus = apt.status;
      }
    }
  });
  const patients = Object.values(patientMap);

  const columns = [
    {
      key: "name", label: "Patient", sortable: true, accessor: "fullName",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13, background: "var(--gradient-patient)" }}>{r.fullName?.[0]}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{r.fullName}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.phone || "—"}</span> },
    { key: "visits", label: "Total Visits", render: (r) => <span style={{ fontWeight: 600, color: "var(--blue-light)" }}>{r.totalVisits}</span> },
    { key: "lastVisit", label: "Last Visit", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.lastVisit)}</span> },
    { key: "status", label: "Last Status", render: (r) => <Badge status={r.lastStatus} /> },
  ];

  return (
    <div>
      <PageHeader title="My Patients" subtitle={`${patients.length} unique patients`} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable columns={columns} data={patients} loading={loading} emptyMessage="No patients found." />
      </motion.div>
    </div>
  );
};

export default MyPatients;
