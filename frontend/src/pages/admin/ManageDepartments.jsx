import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiLayers } from "react-icons/fi";
import { departmentService } from "../../services/departmentService";
import { doctorService } from "../../services/doctorService";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/common/Badge";

const deptColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#06b6d4", "#ec4899"];

const emptyForm = { name: "", description: "", floor: "", wing: "", contactNumber: "", totalBeds: "", headDoctor: "", colorCode: "#3b82f6" };

const ManageDepartments = () => {
  const [depts, setDepts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = () => {
    setLoading(true);
    Promise.all([departmentService.getAll(), doctorService.getAll()])
      .then(([d, docs]) => { setDepts(d.data.data || []); setDoctors(docs.data.data || []); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d) => {
    setEditing(d);
    setForm({ name: d.name, description: d.description || "", floor: d.floor || "", wing: d.wing || "", contactNumber: d.contactNumber || "", totalBeds: d.totalBeds || "", headDoctor: d.headDoctor?._id || "", colorCode: d.colorCode || "#3b82f6" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast.error("Department name is required"); return; }
    setSaving(true);
    try {
      if (editing) await departmentService.update(editing._id, form);
      else await departmentService.create(form);
      toast.success(editing ? "Department updated" : "Department created");
      setModalOpen(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await departmentService.delete(deleteId);
      toast.success("Department deleted");
      setDeleteId(null);
      fetch();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle={`${depts.length} departments active`}
        actions={
          <button className="btn btn-primary" onClick={openAdd}>
            <FiPlus size={16} /> Add Department
          </button>
        }
      />

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {depts.map((dept, idx) => (
            <motion.div
              key={dept._id}
              className="glass-card"
              style={{ padding: 24, position: "relative", overflow: "hidden" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              {/* Color accent strip */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: dept.colorCode || "#3b82f6", borderRadius: "16px 16px 0 0" }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: `${dept.colorCode || "#3b82f6"}20`,
                    border: `1px solid ${dept.colorCode || "#3b82f6"}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <FiLayers size={22} style={{ color: dept.colorCode || "#3b82f6" }} />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="icon-btn" onClick={() => openEdit(dept)}><FiEdit2 size={13} /></button>
                  <button className="icon-btn" onClick={() => setDeleteId(dept._id)} style={{ color: "var(--coral-light)", borderColor: "rgba(244,63,94,0.2)" }}><FiTrash2 size={13} /></button>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{dept.name}</h3>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
                {dept.description || "No description"}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Floor", value: dept.floor || "—" },
                  { label: "Beds", value: `${dept.availableBeds ?? 0}/${dept.totalBeds ?? 0}` },
                  { label: "Head Doctor", value: dept.headDoctor?.fullName?.split(" ").slice(-1)[0] || "—" },
                  { label: "Contact", value: dept.contactNumber || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {depts.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              No departments found. Add your first department!
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Department" : "Add Department"} size="md"
        footer={<><button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editing ? "Save" : "Create"}</button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Department Name *</label>
            <input type="text" className="form-input" placeholder="e.g. Cardiology" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
          {[
            { label: "Floor", name: "floor", placeholder: "3rd Floor" },
            { label: "Wing", name: "wing", placeholder: "East Wing" },
            { label: "Contact Number", name: "contactNumber", placeholder: "+1 555 0001" },
            { label: "Total Beds", name: "totalBeds", type: "number", placeholder: "20" },
          ].map((f) => (
            <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{f.label}</label>
              <input type={f.type || "text"} className="form-input" placeholder={f.placeholder} value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Head Doctor</label>
            <select className="form-input form-select" value={form.headDoctor} onChange={(e) => setForm((p) => ({ ...p, headDoctor: e.target.value }))}>
              <option value="">Select Doctor</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.fullName}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Color</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {deptColors.map((c) => (
                <button key={c} onClick={() => setForm((p) => ({ ...p, colorCode: c }))}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: form.colorCode === c ? "3px solid white" : "2px solid transparent", cursor: "pointer", outline: form.colorCode === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Department"
        footer={<><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></>}>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Are you sure you want to delete this department?</p>
      </Modal>
    </div>
  );
};

export default ManageDepartments;
