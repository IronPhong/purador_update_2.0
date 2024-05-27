const UserModel = require("../models/users");
const fs = require("fs");
const path = require("path");
const pagination = require("../../common/pagination");

 const user = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = limit * page - limit;
  const totalRows = await UserModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);

  const user = await UserModel.find({})

    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  // console.log(products);
  const next = page + 1;
  const hasNext = page < totalPages ? true : false;
  const prev = page - 1;
  const hasPrev = page > 1 ? true : false;

    res.render("admin/users/user", { user,page,
        totalPages,
        next,
        hasNext,
        prev,
        hasPrev,
        pages: pagination(page, totalPages), });
  };

  const create = async (req, res) => {
    
    res.render("admin/users/add_user");
  };
  
  const store =  (req, res) => {

    const body = req.body;
    const user = {
      email: body.email,
      password: body.password,
      role: body.role,
      full_name: body.full_name,

    };
    
    new UserModel(user).save();
    res.redirect("/admin/users");
  };

  const edit = async (req, res) => {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    res.render("admin/users/edit_user", { user });
  };
  
  const update = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const user = {
      email: body.email,
      password: body.password,
      role: body.role,
      full_name: body.full_name,

    };
    
    await UserModel.updateOne({ _id: id }, { $set: user });
    res.redirect("/admin/users");
  };
  
  const del = async (req, res) => {
    const id = req.params.id;
    await UserModel.deleteOne({ _id: id });
    res.redirect("/admin/users");
  };
  

  module.exports = {
    user,
    create,
    store,
    edit, 
    update,
    del,
  };
  
  