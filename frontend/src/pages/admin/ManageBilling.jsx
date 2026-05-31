import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign } from "react-icons/fi";
import { billingService } from "../../services/billingService";
import { patientService } from "../../services/patientService";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/StatCard";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const ManageBilling = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBill, setEditBill] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: "", description: "", amount: "", tax: "0", discount: "0", dueDate: "", notes: "" });

  const fetch = () => {
    setLoading(true);
    Promise.all([
      billingService.getAll(),
      patientService.getAll(),
      billingService.getStats(),
    ]).then(([b, p, s]) => {
      setBills(b.data.data || []);
      setPatients(p.data.data || []);
      setStats(s.data.data || null);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (!form.patient || !form.amount) { toast.error("Patient and amount required"); return; }
    setSaving(true);
    try {
      const items = [{ description: form.description || "Medical Service", quantity: 1, unitPrice: +form.amount, total: +form.amount }];
      await billingService.create({ patient: form.patient, items, tax: +form.tax, discount: +form.discount, dueDate: form.dueDate || undefined, notes: form.notes });
      toast.success("Bill created");
      setModalOpen(false);
      setForm({ patient: "", description: "", amount: "", tax: "0", discount: "0", dueDate: "", notes: "" });
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  const handleMarkPaid = async (id) => {
    try {
      await billingService.update(id, { status: "paid", paymentMethod: "cash" });
      toast.success("Marked as paid");
      fetch();
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async () => {
    try {
      await billingService.delete(deleteId);
      toast.success("Bill deleted");
      setDeleteId(null);
      fetch();
    } catch { toast.error("Delete failed"); }
  };

  const columns = [
    { key: "invoice", label: "Invoice", render: (r) => <span style={{ fontWeight: 600, color: "var(--blue-light)" }}>{r.invoiceNumber}</span> },
    {
      key: "patient", label: "Patient",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 10, background: "var(--gradient-patient)" }}>{r.patient?.fullName?.[0]}</div>
          <span>{r.patient?.fullName || "—"}</span>
        </div>
      ),
    },
    { key: "amount", label: "Amount", render: (r) => <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>${r.totalAmount?.toFixed(2)}</span> },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "due", label: "Due Date", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.dueDate)}</span> },
    { key: "created", label: "Created", render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.createdAt)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Billing Management"
        subtitle="Manage invoices and track payments"
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <FiPlus size={16} /> Create Invoice
          </button>
        }
      />

      {/* Revenue Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard title="Total Revenue" value={stats.totalRevenue} prefix="$" icon={FiDollarSign} color="green" subtitle={`${stats.paidBills} paid`} />
          <StatCard title="Pending" value={stats.pendingAmount} prefix="$" icon={FiDollarSign} color="amber" subtitle={`${stats.pendingBills} invoices`} />
          <StatCard title="Overdue" value={stats.overdueAmount} prefix="$" icon={FiDollarSign} color="coral" subtitle={`${stats.overdueBills} overdue`} />
          <StatCard title="Total Bills" value={stats.totalBills} icon={FiDollarSign} color="blue" subtitle="All invoices" />
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable
          columns={columns} data={bills} loading={loading}
          emptyMessage="No billing records found."
          actions={(row) => (
            <div style={{ display: "flex", gap: 6 }}>
              {row.status === "pending" && (
                <button className="btn btn-success btn-sm" onClick={() => handleMarkPaid(row._id)}>Paid</button>
              )}
              <button className="icon-btn" onClick={() => setDeleteId(row._id)} style={{ color: "var(--coral-light)", borderColor: "rgba(244,63,94,0.2)" }}><FiTrash2 size={14} /></button>
            </div>
          )}
        />
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice" size="md"
        footer={<><button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate} disabled={saving}>{saving ? "Creating..." : "Create Invoice"}</button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Patient *</label>
            <select className="form-input form-select" value={form.patient} onChange={(e) => setForm((p) => ({ ...p, patient: e.target.value }))}>
              <option value="">Select Patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <input type="text" className="form-input" placeholder="Medical consultation, Lab tests..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          {[
            { label: "Amount ($) *", name: "amount", type: "number", placeholder: "500" },
            { label: "Tax (%)", name: "tax", type: "number", placeholder: "0" },
            { label: "Discount ($)", name: "discount", type: "number", placeholder: "0" },
            { label: "Due Date", name: "dueDate", type: "date" },
          ].map((f) => (
            <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{f.label}</label>
              <input type={f.type} className="form-input" placeholder={f.placeholder} value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} />
            </div>
          ))}
          <div className="form-group" style={{ gridColumn: "span 2", marginBottom: 0 }}>
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Invoice"
        footer={<><button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button><button className="btn btn-danger" onClick={handleDelete}>Delete</button></>}>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Are you sure you want to delete this invoice?</p>
      </Modal>
    </div>
  );
};

export default ManageBilling;
