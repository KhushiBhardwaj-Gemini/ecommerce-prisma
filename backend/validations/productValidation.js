const Joi = require("joi");
const CATEGORIES = require("../constants/categories");

const productSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Product name is required",
  }),

  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),

  description: Joi.string().allow("").optional(),

  category: Joi.string()
    .valid(...CATEGORIES)
    .required()
    .messages({
      "any.only": `Category must be one of ${CATEGORIES.join(", ")}`,
      "string.empty": "Category is required",
    }),
});

//multer

module.exports = {
  productSchema,
};
