const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { exportAuditLogs } = require("../controllers/auditController");

// GET /api/admin/audit/export
router.get("/export", authMiddleware, adminMiddleware, exportAuditLogs);


module.exports = router;