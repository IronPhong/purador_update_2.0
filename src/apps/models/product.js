const mongoose = require("../../common/database")();

const productSchema = new mongoose.Schema(
  {
    cat_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
      text: true,
    },
    short_name: {
      type: String,
      text: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: null,
    },
    cc: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    promotion: {
      type: String,
      default: null,
    },
    warranty: {
      type: String,
      default: null,
    },
    accessories: {
      type: String,
      default: null,
    },
    shopee: {
      type: String,
      default: null,
    },
    tiktok: {
      type: String,
      default: null,
    },
    is_stock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema, "products");

module.exports = ProductModel;
