const express = require("express");
const {
  getAllDoctors, getDoctorById, createDoctor,
  updateDoctor, deleteDoctor, getDoctorStats,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getAllDoctors);
router.get("/:id", protect, getDoctorById);
router.get("/:id/stats", protect, authorizeRoles("admin", "doctor"), getDoctorStats);
router.post("/", protect, authorizeRoles("admin"), createDoctor);
router.put("/:id", protect, authorizeRoles("admin"), updateDoctor);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDoctor);

module.exports = router;
