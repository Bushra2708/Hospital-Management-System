const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard stats (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalReceptionists = await User.countDocuments({ role: "receptionist" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    });
    const pendingAppointments = await Appointment.countDocuments({ status: "scheduled" });
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });

    const paidBills = await Billing.find({ status: "paid" });
    const totalRevenue = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);

    const recentAppointments = await Appointment.find()
      .populate("patient", "fullName profileImage")
      .populate("doctor", "fullName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        totalReceptionists,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalRevenue,
        recentAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, profileImage },
      { new: true }
    ).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
