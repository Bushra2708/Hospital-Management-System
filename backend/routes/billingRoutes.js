const express = require("express");
const {
  getAllBills, getBillById, createBill,
  updateBill, deleteBill, getMyBills, getRevenueStats,
} = require("../controllers/billingController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/my", protect, authorizeRoles("patient"), getMyBills);
router.get("/stats", protect, authorizeRoles("admin", "receptionist"), getRevenueStats);
router.get("/", protect, authorizeRoles("admin", "receptionist"), getAllBills);
router.get("/:id", protect, getBillById);
router.post("/", protect, authorizeRoles("admin", "receptionist"), createBill);
router.put("/:id", protect, authorizeRoles("admin", "receptionist"), updateBill);
router.delete("/:id", protect, authorizeRoles("admin"), deleteBill);

module.exports = router;
