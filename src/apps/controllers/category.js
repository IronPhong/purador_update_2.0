const CategoryModel = require("../models/categories");
const pagination = require("../../common/pagination");


  const category = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = limit * page - limit;
  const totalRows = await CategoryModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);

  const category = await CategoryModel.find({})

    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  const next = page + 1;
  const hasNext = page < totalPages ? true : false;
  const prev = page - 1;
  const hasPrev = page > 1 ? true : false;

    res.render("admin/categories/category", { category,page,
        totalPages,
        next,
        hasNext,
        prev,
        hasPrev,
        pages: pagination(page, totalPages), });
  };

  const create = async (req, res) => {
    // const category = await CategoryModel.find({});
    res.render("admin/categories/add_category");
  };
  
  // const store = (req, res) => {
  //   const { body } = req;
  //   const category = {
  //     title: body.title,
  //     // slug: slug(body.name),
  //     description: body.description,
  //   };
  //     new CategoryModel(category).save();
  //     res.redirect("/admin/categories");
  // };
module.exports={
    category,
    create,
    // store
};