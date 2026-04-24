const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Name can only contain letters and spaces",
      "string.empty": "Name is required",
    }),

  email: Joi.string().email().lowercase().required(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain letters, numbers and at least one special character",
      "string.empty": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
