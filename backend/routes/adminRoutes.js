const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { exportAuditLogs } = require("../controllers/auditController");
const {
  getAllProductsAdmin,
  getProductUsers,
} = require("../controllers/adminController");

router.get("/products", authMiddleware, adminMiddleware, getAllProductsAdmin);
router.get("/products/:id/users", authMiddleware, adminMiddleware, getProductUsers);
router.get("/audit-logs/export", authMiddleware, adminMiddleware, exportAuditLogs);

module.exports = router;