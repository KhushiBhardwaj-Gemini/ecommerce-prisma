const productService = require("../services/productService");
const logger = require("../utils/logger");

// CREATE
const createProduct = async (req, res) => {
  try {
    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    const product = await productService.createProduct(
      {
        title: req.body.title,
        price: Number(req.body.price),
        description: req.body.description,
        category: req.body.category?.toLowerCase().trim(),
        image: image,
      },
      req.user.id,
    );

    res.status(201).json(product);
  } catch (err) {
    logger.error(`Create product error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL (PUBLIC)
const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);
    res.json(products);
  } catch (err) {
    logger.error(`Get products error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

// GET BY ID (PUBLIC)
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    logger.error(`Get product by ID error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const updatedData = {};

    if (req.body.title) updatedData.title = req.body.title;
    if (req.body.price) updatedData.price = req.body.price;
    if (req.body.description) updatedData.description = req.body.description;
    if (req.body.category) updatedData.category = req.body.category;

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updated = await productService.updateProduct(
      req.params.id,
      updatedData,
      req.user,
    );

    res.json(updated);
  } catch (err) {
    logger.error(`Update product error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(
      req.params.id,
      req.user,
    );
    res.json({ msg: "Product deleted" });
  } catch (err) {
    logger.error(`Delete product error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
