const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "insurance", "online", ""],
      default: "",
    },
    dueDate: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number before saving
billingSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const latestBill = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
    let nextNum = 1;
    if (latestBill && latestBill.invoiceNumber) {
      const match = latestBill.invoiceNumber.match(/INV-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    this.invoiceNumber = `INV-${String(nextNum).padStart(5, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Billing", billingSchema);
