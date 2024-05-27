const BlogModel = require("../models/blog");
const allBlogModel = require("../models/allblogs");
const slug = require("slug");
const fs = require("fs");
const path = require("path");
const pagination = require("../../common/pagination");

const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = limit * page - limit;
  const totalRows = await BlogModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);

  const blogs = await BlogModel.find({})
    .populate({ path: "cat_id" })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  // console.log(products);
  const next = page + 1;
  const hasNext = page < totalPages ? true : false;
  const prev = page - 1;
  const hasPrev = page > 1 ? true : false;

  res.render("admin/blogs/blog", {
    blogs,
    page,
    totalPages,
    next,
    hasNext,
    prev,
    hasPrev,
    pages: pagination(page, totalPages),
  });
};
const create = async (req, res) => {
  const blogs = await BlogModel.find();
  res.render("admin/blogs/add_blog", { blogs });
};

const store = (req, res) => {
  const { file, body } = req;
  const blog = {
    title: body.title,
    slug: slug(body.title),
    brief: body.brief,
    cat_id: body.cat_id,
    description: body.description,
  };

  if (file) {
    const thumbnail = "blogs/" + file.originalname;
    fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
    blog["thumbnail"] = thumbnail;
    new BlogModel(blog).save();
    res.redirect("/admin/blogs");
  }
};

const edit = async (req, res) => {
  const id = req.params.id;
  const blogs = await BlogModel.find();
  const blog = await BlogModel.findById(id);
  res.render("admin/blogs/edit_blog", { blogs, blog });
};

const update = async (req, res) => {
  const id = req.params.id;
  const { file, body } = req;
  const blog = {
    title: body.title,
    slug: slug(body.name),
    brief: body.brief,

    main: body.main,


    description: body.description,
  };
  if (file) {
    const thumbnail = "blogs/" + file.originalname;
    fs.renameSync(file.path, path.resolve("src/public/images", thumbnail));
    blog["thumbnail"] = thumbnail;
  }
  await BlogModel.updateOne({ _id: id }, { $set: blog });
  res.redirect("/admin/blogs");
};

const del = async (req, res) => {
  const id = req.params.id;
  await BlogModel.deleteOne({ _id: id });
  res.redirect("/admin/blogs");
};

module.exports = {
  index,
  create,
  store,
  edit,
  update,
  del,
};
