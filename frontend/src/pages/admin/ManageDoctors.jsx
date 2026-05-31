import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { doctorService } from "../../services/doctorService";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";

const emptyForm = {
  fullName: "", email: "", password: "", phone: "",
  specialty: "", qualification: "MBBS", experience: "", consultationFee: "", bio: "",
};

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchDoctors = () => {
    setLoading(true);
    doctorService.getAll()
      .then((res) => setDoctors(res.data.data || []))
      .catch(() => toast.error("Failed to load doctors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (doc) => {
    setEditing(doc);
    setForm({
      fullName: doc.fullName || "",
      email: doc.email || "",
      password: "",
      phone: doc.phone || "",
      specialty: doc.profile?.specialty || "",
      qualification: doc.profile?.qualification || "MBBS",
      experience: doc.profile?.experience || "",
      consultationFee: doc.profile?.consultationFee || "",
      bio: doc.profile?.bio || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.email || !form.specialty) {
      toast.error("Full name, email, and specialty are required");
      return;
    }
    if (!editing && !form.password) { toast.error("Password is required for new doctor"); return; }

    setSaving(true);
    try {
      if (editing) {
        await doctorService.update(editing._id, form);
        toast.success("Doctor updated");
      } else {
        await doctorService.create(form);
        toast.success("Doctor added successfully");
      }
      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await doctorService.delete(deleteId);
      toast.success("Doctor removed");
      setDeleteId(null);
      fetchDoctors();
    } catch { toast.error("Delete failed"); }
  };

  const columns = [
    {
      key: "name", label: "Doctor", accessor: "fullName", sortable: true,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13, background: "var(--gradient-doctor)" }}>
            {row.fullName?.[0]}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{row.fullName}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "specialty", label: "Specialty",
      render: (row) => <span style={{ color: "var(--text-secondary)" }}>{row.profile?.specialty || "—"}</span>,
    },
    {
      key: "experience", label: "Experience",
      render: (row) => <span style={{ color: "var(--text-secondary)" }}>{row.profile?.experience ? `${row.profile.experience} yrs` : "—"}</span>,
    },
    {
      key: "fee", label: "Consult Fee",
      render: (row) => <span style={{ color: "var(--emerald-light)", fontWeight: 500 }}>{row.profile?.consultationFee ? `$${row.profile.consultationFee}` : "—"}</span>,
    },
    {
      key: "rating", label: "Rating",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <FiStar size={13} style={{ color: "var(--amber)" }} />
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{row.profile?.rating || "4.5"}</span>
        </div>
      ),
    },
    {
      key: "status", label: "Status",
      render: (row) => <Badge status={row.profile?.isAvailable !== false ? "available" : "unavailable"} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Doctors"
        subtitle={`${doctors.length} doctors registered`}
        actions={
          <button id="add-doctor-btn" className="btn btn-primary" onClick={openAdd}>
            <FiPlus size={16} /> Add Doctor
          </button>
        }
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={doctors}
          loading={loading}
          emptyMessage="No doctors found. Add your first doctor!"
          actions={(row) => (
            <div style={{ display: "flex", gap: 6 }}>
              <button className="icon-btn" onClick={() => openEdit(row)} title="Edit">
                <FiEdit2 size={14} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setDeleteId(row._id)}
                title="Delete"
                style={{ color: "var(--coral-light)", borderColor: "rgba(244,63,94,0.2)" }}
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        />
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Doctor" : "Add New Doctor"}
        size="lg"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Doctor"}
            </button>
          </>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Full Name *", name: "fullName", type: "text", placeholder: "Dr. John Smith" },
            { label: "Email *", name: "email", type: "email", placeholder: "doctor@email.com", disabled: !!editing },
            { label: editing ? "New Password (leave blank to keep)" : "Password *", name: "password", type: "password", placeholder: "Min 6 chars" },
            { label: "Phone", name: "phone", type: "tel", placeholder: "+1 555 000 0000" },
            { label: "Specialty *", name: "specialty", type: "text", placeholder: "Cardiology" },
            { label: "Qualification", name: "qualification", type: "text", placeholder: "MBBS, MD" },
            { label: "Experience (years)", name: "experience", type: "number", placeholder: "5" },
            { label: "Consultation Fee ($)", name: "consultationFee", type: "number", placeholder: "100" },
          ].map((f) => (
            <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{f.label}</label>
              <input
                type={f.type}
                className="form-input"
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                disabled={f.disabled}
              />
            </div>
          ))}
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Bio</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief professional bio..."
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Doctor"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </>
        }
      >
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          Are you sure you want to delete this doctor? This action cannot be undone and will remove all associated data.
        </p>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
