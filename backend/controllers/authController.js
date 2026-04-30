const authService = require("../services/authService");
const logger = require("../utils/logger");

// REGISTER
const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.json(result);
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(400).json({ msg: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(400).json({ msg: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    logger.error(`Fetching user error: ${err.message}`);
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
