const prisma = require("../config/prisma");
const logger = require("../utils/logger");
const XLSX = require("xlsx");

const exportAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = logs.map((log) => ({
      User: log.user?.email || "-",
      Action: log.action,
      Entity: log.entity,
      Date: new Date(log.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const getColumnWidths = (data) =>
      Object.keys(data[0]).map((key) => ({
        wch:
          Math.max(
            key.length,
            ...data.map((row) => (row[key] ? row[key].toString().length : 0)),
          ) + 2,
      }));

    worksheet["!cols"] = getColumnWidths(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AuditLogs");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    res.setHeader("Content-Disposition", "attachment; filename=auditLogs.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    logger.info(`Audit logs exported by admin ${req.user.id}`);
    res.send(buffer);
  } catch (err) {
    logger.error(`Audit export failed: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { exportAuditLogs };
