const Department = require("../models/Department");

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("headDoctor", "fullName email phone")
      .sort({ name: 1 });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single department
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("headDoctor", "fullName email phone");
    if (!department) return res.status(404).json({ success: false, message: "Department not found" });
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, headDoctor, floor, wing, contactNumber, totalBeds, colorCode } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Department name is required" });

    const existing = await Department.findOne({ name });
    if (existing) return res.status(400).json({ success: false, message: "Department already exists" });

    const department = await Department.create({
      name,
      description: description || "",
      headDoctor: headDoctor || null,
      floor: floor || "",
      wing: wing || "",
      contactNumber: contactNumber || "",
      totalBeds: totalBeds || 0,
      availableBeds: totalBeds || 0,
      colorCode: colorCode || "#3b82f6",
    });

    const populated = await department.populate("headDoctor", "fullName email");
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description, headDoctor, floor, wing, contactNumber, totalBeds, availableBeds, colorCode, isActive } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, headDoctor, floor, wing, contactNumber, totalBeds, availableBeds, colorCode, isActive },
      { new: true }
    ).populate("headDoctor", "fullName email");

    if (!department) return res.status(404).json({ success: false, message: "Department not found" });
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
