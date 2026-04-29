const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllProductsAdmin,
  getProductUsers,
} = require("../controllers/adminController");

router.get("/products", authMiddleware, adminMiddleware, getAllProductsAdmin);
router.get("/products/:id/users", authMiddleware, adminMiddleware, getProductUsers);

module.exports = router;