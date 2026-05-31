const User = require("../models/User");
const Doctor = require("../models/Doctor");

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const users = await User.find({ role: "doctor" }).select("-password");
    const doctors = await Promise.all(
      users.map(async (user) => {
        const profile = await Doctor.findOne({ userId: user._id }).populate("department", "name");
        return { ...user.toObject(), profile: profile || null };
      })
    );
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.role !== "doctor") {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    const profile = await Doctor.findOne({ userId: user._id }).populate("department", "name");
    res.status(200).json({ success: true, data: { ...user.toObject(), profile: profile || null } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create doctor (admin creates user + doctor profile)
exports.createDoctor = async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const {
      fullName, email, password, phone,
      specialty, qualification, experience,
      consultationFee, bio, availableDays, availableTimeSlots, department,
    } = req.body;

    if (!fullName || !email || !password || !specialty) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword, role: "doctor", phone });

    const profile = await Doctor.create({
      userId: user._id,
      specialty,
      qualification: qualification || "MBBS",
      experience: experience || 0,
      consultationFee: consultationFee || 0,
      bio: bio || "",
      availableDays: availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableTimeSlots: availableTimeSlots || ["09:00", "10:00", "11:00", "14:00", "15:00"],
      department: department || null,
    });

    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, data: { ...userObj, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { fullName, phone, specialty, qualification, experience, consultationFee, bio, availableDays, availableTimeSlots, department, isAvailable } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "Doctor not found" });

    const profile = await Doctor.findOneAndUpdate(
      { userId: req.params.id },
      { specialty, qualification, experience, consultationFee, bio, availableDays, availableTimeSlots, department, isAvailable },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: { ...user.toObject(), profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findOneAndDelete({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor stats
exports.getDoctorStats = async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalAppointments = await Appointment.countDocuments({ doctor: req.params.id });
    const todayAppointments = await Appointment.countDocuments({
      doctor: req.params.id,
      date: { $gte: today, $lt: tomorrow },
    });
    const completedAppointments = await Appointment.countDocuments({ doctor: req.params.id, status: "completed" });

    const uniquePatients = await Appointment.distinct("patient", { doctor: req.params.id });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        todayAppointments,
        completedAppointments,
        totalPatients: uniquePatients.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
