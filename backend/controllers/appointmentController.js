const Appointment = require("../models/Appointment");

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctor, patient } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "fullName email phone profileImage")
      .populate("doctor", "fullName email phone profileImage")
      .sort({ date: -1, time: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, type, symptoms, notes } = req.body;

    if (!doctor || !date || !time) {
      return res.status(400).json({ success: false, message: "Doctor, date, and time are required" });
    }

    // Check for conflicts
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      doctor,
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $in: ["scheduled", "confirmed"] },
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: "Time slot already booked" });
    }

    const patient = req.user.role === "patient" ? req.user._id : req.body.patient;

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      time,
      type: type || "consultation",
      symptoms: symptoms || "",
      notes: notes || "",
    });

    const populated = await appointment.populate([
      { path: "patient", select: "fullName email phone" },
      { path: "doctor", select: "fullName email phone" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { status, notes, prescription, diagnosis, cancelReason, date, time, type } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes, prescription, diagnosis, cancelReason, date, time, type },
      { new: true }
    )
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled", cancelReason: cancelReason || "Cancelled by user" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointments for logged-in user (patient or doctor)
exports.getMyAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "patient") filter.patient = req.user._id;
    else if (req.user.role === "doctor") filter.doctor = req.user._id;

    const appointments = await Appointment.find(filter)
      .populate("patient", "fullName email phone")
      .populate("doctor", "fullName email phone")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const total = await Appointment.countDocuments();
    const todayCount = await Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } });
    const scheduled = await Appointment.countDocuments({ status: "scheduled" });
    const completed = await Appointment.countDocuments({ status: "completed" });
    const cancelled = await Appointment.countDocuments({ status: "cancelled" });

    res.status(200).json({
      success: true,
      data: { total, todayCount, scheduled, completed, cancelled },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
