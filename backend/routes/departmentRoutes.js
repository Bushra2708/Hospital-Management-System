const express = require("express");
const {
  getAllDepartments, getDepartmentById, createDepartment,
  updateDepartment, deleteDepartment,
} = require("../controllers/departmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getAllDepartments);
router.get("/:id", protect, getDepartmentById);
router.post("/", protect, authorizeRoles("admin"), createDepartment);
router.put("/:id", protect, authorizeRoles("admin"), updateDepartment);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDepartment);

module.exports = router;
