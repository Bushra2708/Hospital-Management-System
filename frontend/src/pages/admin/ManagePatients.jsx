import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { patientService } from "../../services/patientService";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const emptyForm = {
  fullName: "", email: "", password: "", phone: "",
  dateOfBirth: "", gender: "", bloodType: "Unknown", address: "",
};

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = () => {
    setLoading(true);
    patientService.getAll()
      .then((r) => setPatients(r.data.data || []))
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      fullName: p.fullName || "", email: p.email || "", password: "", phone: p.phone || "",
      dateOfBirth: p.profile?.dateOfBirth?.split("T")[0] || "",
      gender: p.profile?.gender || "",
      bloodType: p.profile?.bloodType || "Unknown",
      address: p.profile?.address || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.email) { toast.error("Name and email are required"); return; }
    if (!editing && !form.password) { toast.error("Password required"); return; }
    setSaving(true);
    try {
      if (editing) await patientService.update(editing._id, form);
      else await patientService.create(form);
      toast.success(editing ? "Patient updated" : "Patient registered");
      setModalOpen(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await patientService.delete(deleteId);
      toast.success("Patient removed");
      setDeleteId(null);
      fetch();
    } catch { toast.error("Delete failed"); }
  };

  const columns = [
    {
      key: "name", label: "Patient", accessor: "fullName", sortable: true,
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13, background: "var(--gradient-patient)" }}>
            {r.fullName?.[0]}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{r.fullName}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", accessor: "phone", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.phone || "—"}</span> },
    { key: "blood", label: "Blood Type", render: (r) => <Badge status="active" label={r.profile?.bloodType || "Unknown"} variant="badge-coral" /> },
    { key: "gender", label: "Gender", render: (r) => <span style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>{r.profile?.gender || "—"}</span> },
    { key: "dob", label: "Date of Birth", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{r.profile?.dateOfBirth ? new Date(r.profile.dateOfBirth).toLocaleDateString() : "—"}</span> },
    { key: "status", label: "Status", render: (r) => <Badge status={r.profile?.isActive !== false ? "active" : "inactive"} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Patients"
        subtitle={`${patients.length} patients registered`}
        actions={
          <button className="btn btn-primary" onClick={openAdd}>
            <FiPlus size={16} /> Register Patient
          </button>
        }
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns} data={patients} loading={loading}
          emptyMessage="No patients found."
          actions={(row) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button className="icon-btn" onClick={() => openEdit(row)}><FiEdit2 size={14} /></button>
              <button className="icon-btn" onClick={() => setDeleteId(row._id)} style={{ color: "var(--coral-light)", borderColor: "rgba(244,63,94,0.2)" }}><FiTrash2 size={14} /></button>
            </div>
          )}
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Patient" : "Register Patient"} size="lg"
        footer={<><button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editing ? "Save" : "Register"}</button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Full Name *", name: "fullName", type: "text" },
            { label: "Email *", name: "email", type: "email", disabled: !!editing },
            { label: editing ? "New Password" : "Password *", name: "password", type: "password" },
            { label: "Phone", name: "phone", type: "tel" },
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
            { label: "Address", name: "address", type: "text" },
          ].map((f) => (
            <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{f.label}</label>
              <input type={f.type} className="form-input" value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} disabled={f.disabled} />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Gender</label>
            <select className="form-input form-select" value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Blood Type</label>
            <select className="form-input form-select" value={form.bloodType} onChange={(e) => setForm((p) => ({ ...p, bloodType: e.target.value }))}>
              {["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Patient"
        footer={<><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></>}>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          Are you sure you want to remove this patient? All their appointment and billing records will also be affected.
        </p>
      </Modal>
    </div>
  );
};

export default ManagePatients;
