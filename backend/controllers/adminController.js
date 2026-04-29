const adminService = require("../services/adminService");

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await adminService.getAllProductsAdmin();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getProductUsers = async (req, res) => {
  try {
    const data = await adminService.getProductUsers(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getAllProductsAdmin,
  getProductUsers,
};