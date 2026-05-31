const Billing = require("../models/Billing");

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const { status, patient } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (patient) filter.patient = patient;

    const bills = await Billing.find(filter)
      .populate("patient", "fullName email phone")
      .populate("appointment", "date time type")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single bill
exports.getBillById = async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate("patient", "fullName email phone")
      .populate("appointment", "date time type status");

    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create bill
exports.createBill = async (req, res) => {
  try {
    const { patient, appointment, items, tax, discount, dueDate, notes, paymentMethod } = req.body;

    if (!patient || !items || !items.length) {
      return res.status(400).json({ success: false, message: "Patient and items are required" });
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * (tax || 0)) / 100;
    const totalAmount = subtotal + taxAmount - (discount || 0);

    const bill = await Billing.create({
      patient,
      appointment: appointment || null,
      items,
      subtotal,
      tax: taxAmount,
      discount: discount || 0,
      totalAmount,
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: notes || "",
      paymentMethod: paymentMethod || "",
    });

    const populated = await bill.populate([
      { path: "patient", select: "fullName email phone" },
      { path: "appointment", select: "date time type" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update bill (mark paid, update status)
exports.updateBill = async (req, res) => {
  try {
    const { status, paymentMethod, notes } = req.body;
    const updateData = { status, paymentMethod, notes };
    if (status === "paid") updateData.paidAt = new Date();

    const bill = await Billing.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("patient", "fullName email phone")
      .populate("appointment", "date time type");

    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Bill deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my bills (patient)
exports.getMyBills = async (req, res) => {
  try {
    const bills = await Billing.find({ patient: req.user._id })
      .populate("appointment", "date time type")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Revenue stats
exports.getRevenueStats = async (req, res) => {
  try {
    const paidBills = await Billing.find({ status: "paid" });
    const pendingBills = await Billing.find({ status: "pending" });
    const overdueBills = await Billing.find({ status: "overdue" });

    const totalRevenue = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingAmount = pendingBills.reduce((sum, b) => sum + b.totalAmount, 0);
    const overdueAmount = overdueBills.reduce((sum, b) => sum + b.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        pendingAmount,
        overdueAmount,
        totalBills: await Billing.countDocuments(),
        paidBills: paidBills.length,
        pendingBills: pendingBills.length,
        overdueBills: overdueBills.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
