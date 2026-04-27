const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  clearCart,
  updateCart,
} = require("../controllers/cartController");

//add to cart
router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/clear", authMiddleware, clearCart);
router.patch("/update", authMiddleware, updateCart);
module.exports = router;
