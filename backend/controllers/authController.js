const authService = require("../services/authService");

// REGISTER
const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
