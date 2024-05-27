const CategoryModel = require("../models/categories");

module.exports = async (req, res, next) => {
  res.locals.categories = await CategoryModel.find();
  res.locals.totalCartItem = req.session.cart.reduce(
    (total, item) => total + item.qty,
    0
  );
  next();
};
