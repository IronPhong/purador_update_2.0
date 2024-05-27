const mongoose = require("../../common/database")();

const categorySchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", categorySchema, "categories");
module.exports = CategoryModel;
