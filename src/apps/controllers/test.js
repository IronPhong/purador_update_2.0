const CategoryModel = require("../models/categories");
const ProductModel = require("../models/product");

let test = async (req, res) => {
  const products = await ProductModel.find();
  console.log(products);
};

const testForm = (req, res) => {
  res.send(`
        <form method=post>
        <input type=text name=email />
        <input type=submit name=sbm value= send />
        </form>
    `);
};
const actionForm = (req, res) => {
  res.send(req.body.email);
};

module.exports = {
  test,
  testForm,
  actionForm,
};
