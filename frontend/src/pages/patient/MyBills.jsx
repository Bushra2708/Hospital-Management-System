import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiDownload } from "react-icons/fi";
import { billingService } from "../../services/billingService";
import DataTable from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const MyBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailBill, setDetailBill] = useState(null);

  useEffect(() => {
    billingService
      .getMyBills()
      .then((r) => setBills(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = bills.filter((b) => b.status === "paid").reduce((s, b) => s + b.totalAmount, 0);
  const totalPending = bills.filter((b) => b.status === "pending").reduce((s, b) => s + b.totalAmount, 0);

  const columns = [
    {
      key: "invoice",
      label: "Invoice #",
      render: (r) => (
        <span style={{ fontWeight: 600, color: "var(--blue-light)" }}>{r.invoiceNumber}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (r) => (
        <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>
          ${r.totalAmount?.toFixed(2)}
        </span>
      ),
    },
    { key: "status", label: "Status", render: (r) => <Badge status={r.status} /> },
    {
      key: "due",
      label: "Due Date",
      render: (r) => (
        <span
          style={{
            color:
              r.status === "overdue" ? "var(--coral-light)" : "var(--text-secondary)",
          }}
        >
          {formatDate(r.dueDate)}
        </span>
      ),
    },
    {
      key: "paid",
      label: "Paid On",
      render: (r) => (
        <span style={{ color: "var(--emerald-light)" }}>
          {r.paidAt ? formatDate(r.paidAt) : "—"}
        </span>
      ),
    },
    {
      key: "created",
      label: "Created",
      render: (r) => <span style={{ color: "var(--text-secondary)" }}>{formatDate(r.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader title="My Bills" subtitle={`${bills.length} invoices`} />

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Total Paid",
            value: `$${totalPaid.toFixed(2)}`,
            color: "var(--emerald)",
            bg: "rgba(16,185,129,0.1)",
            border: "rgba(16,185,129,0.2)",
          },
          {
            label: "Pending Amount",
            value: `$${totalPending.toFixed(2)}`,
            color: "var(--amber)",
            bg: "rgba(245,158,11,0.1)",
            border: "rgba(245,158,11,0.2)",
          },
          {
            label: "Total Invoices",
            value: bills.length,
            color: "var(--blue-light)",
            bg: "rgba(59,130,246,0.1)",
            border: "rgba(59,130,246,0.2)",
          },
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "20px 22px",
              borderRadius: 16,
              background: card.bg,
              border: `1px solid ${card.border}`,
            }}
          >
            <p
              style={{
                fontSize: 11.5,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: 8,
              }}
            >
              {card.label}
            </p>
            <p
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: card.color,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {card.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DataTable
          columns={columns}
          data={bills}
          loading={loading}
          emptyMessage="No bills found."
          actions={(row) => (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setDetailBill(row)}
            >
              View
            </button>
          )}
        />
      </motion.div>

      {/* Bill Detail */}
      {detailBill && (
        <Modal
          isOpen={!!detailBill}
          onClose={() => setDetailBill(null)}
          title={`Invoice ${detailBill.invoiceNumber}`}
          size="md"
        >
          <div>
            {/* Items */}
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                    {["Description", "Qty", "Unit Price", "Total"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          fontSize: 11.5,
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(detailBill.items || []).map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 14px", fontSize: 13 }}>{item.description}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-secondary)" }}>{item.quantity}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-secondary)" }}>${item.unitPrice?.toFixed(2)}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600 }}>${item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {[
                ["Subtotal", `$${detailBill.subtotal?.toFixed(2)}`],
                ["Tax", `$${detailBill.tax?.toFixed(2)}`],
                ["Discount", `-$${detailBill.discount?.toFixed(2)}`],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", gap: 24, color: "var(--text-secondary)", fontSize: 13 }}>
                  <span>{label}</span>
                  <span style={{ minWidth: 80, textAlign: "right" }}>{val}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: 10,
                  marginTop: 4,
                }}
              >
                <span>Total</span>
                <span style={{ minWidth: 80, textAlign: "right", color: "var(--emerald-light)" }}>
                  ${detailBill.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Status / Notes */}
            <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge status={detailBill.status} />
              {detailBill.notes && (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{detailBill.notes}</span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyBills;
