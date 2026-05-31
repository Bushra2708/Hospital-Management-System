const statusMap = {
  // Appointment statuses
  scheduled: { label: "Scheduled", cls: "badge-blue" },
  confirmed: { label: "Confirmed", cls: "badge-green" },
  completed: { label: "Completed", cls: "badge-green" },
  cancelled: { label: "Cancelled", cls: "badge-coral" },
  "no-show": { label: "No Show", cls: "badge-amber" },
  // Billing statuses
  pending: { label: "Pending", cls: "badge-amber" },
  paid: { label: "Paid", cls: "badge-green" },
  overdue: { label: "Overdue", cls: "badge-coral" },
  refunded: { label: "Refunded", cls: "badge-violet" },
  // Roles
  admin: { label: "Admin", cls: "badge-violet" },
  doctor: { label: "Doctor", cls: "badge-blue" },
  patient: { label: "Patient", cls: "badge-green" },
  receptionist: { label: "Receptionist", cls: "badge-amber" },
  // Generic
  active: { label: "Active", cls: "badge-green" },
  inactive: { label: "Inactive", cls: "badge-gray" },
  available: { label: "Available", cls: "badge-green" },
  unavailable: { label: "Unavailable", cls: "badge-coral" },
  // Appointment types
  consultation: { label: "Consultation", cls: "badge-blue" },
  "follow-up": { label: "Follow-up", cls: "badge-violet" },
  emergency: { label: "Emergency", cls: "badge-coral" },
  routine: { label: "Routine", cls: "badge-green" },
  specialist: { label: "Specialist", cls: "badge-amber" },
};

const Badge = ({ status, label: customLabel, variant }) => {
  const key = (status || "").toLowerCase();
  const config = statusMap[key] || { label: status || "", cls: variant || "badge-gray" };

  return (
    <span className={`badge ${config.cls}`}>
      {customLabel || config.label}
    </span>
  );
};

export default Badge;
