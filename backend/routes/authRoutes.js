const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const { register, login, getMe } = require("../controllers/authController");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, getMe); //params either query, or string params

module.exports = router;
