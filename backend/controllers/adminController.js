const adminService = require("../services/adminService");
const logger = require("../utils/logger");

const getAllProductsAdmin = async (req, res) => {
  try {
    logger.info(`Admin ${req.user.id} hit GET /admin/products`);
    const products = await adminService.getAllProductsAdmin();
    res.json(products);
  } catch (err) {
    logger.error(`Admin fetch products error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

const getProductUsers = async (req, res) => {
  try {
    logger.info(`Admin ${req.user.id} requested users for product ${req.params.id}`);
    const data = await adminService.getProductUsers(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error(`Admin fetch users error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getAllProductsAdmin,
  getProductUsers,
};