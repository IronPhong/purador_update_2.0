const UserModel = require("../models/users");
const ProductModel = require("../models/product");
const CommentModel = require("../models/comments");
const BlogModel = require("../models/blog");

const index = async (req, res) => {
  const users = await UserModel.find();
  const products = await ProductModel.find();
  const comments = await CommentModel.find();
  const blogs = await BlogModel.find();

  res.render("admin/admin", {
    users: users.length,
    products: products.length,
    comments: comments.length,
    blogs: blogs.length,
  });
};
module.exports = {
  index,
};
