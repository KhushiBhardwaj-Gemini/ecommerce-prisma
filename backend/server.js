const express = require("express");
require("dotenv").config();
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/loggerMiddleware");
const auditRoutes = require("./routes/auditRoutes");
const app = express();

// middleware
app.use(requestLogger);
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/admin/audit", auditRoutes);

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
