const express = require("express");
require("dotenv").config();
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", productRoutes);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
