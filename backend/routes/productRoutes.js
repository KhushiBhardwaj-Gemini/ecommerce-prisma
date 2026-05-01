const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { productSchema } = require("../validations/productValidation");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/upload");
const sellerOrAdmin = require("../middleware/sellerOrAdmin");

//routes
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  sellerOrAdmin,
  upload.single("image"),
  validate(productSchema),
  createProduct,
);
router.patch("/:id", authMiddleware, sellerOrAdmin, upload.single("image"), validate(productSchema), updateProduct);
router.delete("/:id", authMiddleware, sellerOrAdmin, deleteProduct);

module.exports = router;
