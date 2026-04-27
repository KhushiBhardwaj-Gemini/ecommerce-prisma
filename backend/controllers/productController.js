const productService = require("../services/productService");

// CREATE
const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const product = await productService.createProduct(
      {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category?.toLowerCase().trim(),
        image: req.file.filename,
      },
      req.user.id,
    );

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL (PUBLIC)
const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);
    res.json(products);
  } catch (err) {
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
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    //check if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    //ownership check
    if (product.user_id !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

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
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    //if product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    //ownership check
    if (product.user_id !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await productService.deleteProduct(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
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
