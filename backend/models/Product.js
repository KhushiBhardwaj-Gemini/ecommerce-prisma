const mongoose = require("mongoose");
const CATEGORIES = require("../constants/categories");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    price: { type: Number, required: true },

    description: { type: String },

    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },

    image: { type: String, required: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
