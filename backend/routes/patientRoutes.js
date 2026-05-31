const express = require("express");
const {
  getAllPatients, getPatientById, createPatient,
  updatePatient, deletePatient, getMyProfile,
} = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/me", protect, authorizeRoles("patient"), getMyProfile);
router.get("/", protect, authorizeRoles("admin", "doctor", "receptionist"), getAllPatients);
router.get("/:id", protect, authorizeRoles("admin", "doctor", "receptionist"), getPatientById);
router.post("/", protect, authorizeRoles("admin", "receptionist"), createPatient);
router.put("/:id", protect, authorizeRoles("admin", "receptionist"), updatePatient);
router.delete("/:id", protect, authorizeRoles("admin"), deletePatient);

module.exports = router;
