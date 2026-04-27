const cartService = require("../services/cartService");

//add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const result = await cartService.addToCart(userId, productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await cartService.clearCart(userId);
    res.json({ msg: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, type } = req.body;

    const result = await cartService.updateQuantity(userId, productId, type);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  updateCart,
};
