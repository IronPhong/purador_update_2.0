const mongoose = require("../../common/database")();

const allBlogSchema = new mongoose.Schema(
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
    main: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const allBlogModel = mongoose.model("AllBlog", allBlogSchema, "allBlogs");
module.exports = allBlogModel;
