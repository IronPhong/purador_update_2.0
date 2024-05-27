const CommentModel = require("../models/comments");
const pagination = require("../../common/pagination");

const comment = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = limit * page - limit;
  const totalRows = await CommentModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);

  const comment = await CommentModel.find({})

    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  // console.log(products);
  const next = page + 1;
  const hasNext = page < totalPages ? true : false;
  const prev = page - 1;
  const hasPrev = page > 1 ? true : false;

    res.render("admin/comments/comment", { comment,page,
        totalPages,
        next,
        hasNext,
        prev,
        hasPrev,
        pages: pagination(page, totalPages), });
  };

  const del = async (req, res) => {
    const id = req.params.id;
    await CommentModel.deleteOne({ _id: id });
    res.redirect("/admin/comments");
  };
  
module.exports = {
comment, del
  };
  