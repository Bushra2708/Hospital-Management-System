const User = require("../models/User");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const users = await User.find({ role: "patient" }).select("-password");
    const patients = await Promise.all(
      users.map(async (user) => {
        const profile = await Patient.findOne({ userId: user._id });
        return { ...user.toObject(), profile: profile || null };
      })
    );
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient
exports.getPatientById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.role !== "patient") {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    const profile = await Patient.findOne({ userId: user._id });
    res.status(200).json({ success: true, data: { ...user.toObject(), profile: profile || null } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create patient
exports.createPatient = async (req, res) => {
  try {
    const {
      fullName, email, password, phone,
      dateOfBirth, gender, bloodType, address,
      emergencyContact, medicalHistory, allergies, insuranceProvider, insuranceNumber,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "patient123", 10);
    const user = await User.create({ fullName, email, password: hashedPassword, role: "patient", phone });

    const profile = await Patient.create({
      userId: user._id,
      dateOfBirth,
      gender,
      bloodType: bloodType || "Unknown",
      address: address || "",
      emergencyContact: emergencyContact || {},
      medicalHistory: medicalHistory || [],
      allergies: allergies || [],
      insuranceProvider: insuranceProvider || "",
      insuranceNumber: insuranceNumber || "",
    });

    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, data: { ...userObj, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { fullName, phone, dateOfBirth, gender, bloodType, address, emergencyContact, medicalHistory, allergies, insuranceProvider, insuranceNumber, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "Patient not found" });

    const profile = await Patient.findOneAndUpdate(
      { userId: req.params.id },
      { dateOfBirth, gender, bloodType, address, emergencyContact, medicalHistory, allergies, insuranceProvider, insuranceNumber, isActive },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: { ...user.toObject(), profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findOneAndDelete({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient's own profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const profile = await Patient.findOne({ userId: req.user._id });
    res.status(200).json({ success: true, data: { ...user.toObject(), profile: profile || null } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
