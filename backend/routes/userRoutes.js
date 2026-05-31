const express = require("express");
const {
  getAllUsers, getDashboardStats, getProfile,
  updateProfile, changePassword, deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/dashboard-stats", protect, authorizeRoles("admin"), getDashboardStats);
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
