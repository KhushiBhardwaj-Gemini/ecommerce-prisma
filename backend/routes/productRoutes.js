const express = require("express");
const router = express.Router();

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

//routes
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(productSchema),
  createProduct,
);
router.patch("/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
