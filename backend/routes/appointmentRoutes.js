const express = require("express");
const {
  getAllAppointments, getAppointmentById, bookAppointment,
  updateAppointment, cancelAppointment, getMyAppointments,
  getStats, deleteAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/my", protect, getMyAppointments);
router.get("/stats", protect, authorizeRoles("admin", "receptionist"), getStats);
router.get("/", protect, authorizeRoles("admin", "doctor", "receptionist"), getAllAppointments);
router.get("/:id", protect, getAppointmentById);
router.post("/", protect, bookAppointment);
router.put("/:id", protect, authorizeRoles("admin", "doctor", "receptionist"), updateAppointment);
router.put("/:id/cancel", protect, cancelAppointment);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAppointment);

module.exports = router;
