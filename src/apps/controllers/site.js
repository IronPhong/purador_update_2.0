const ProductModel = require("../models/product");
const CategoryModel = require("../models/categories");
const CustomerModel = require("../models/customers");
const CommentModel = require("../models/comments");
const slug = require("slug");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const pagination = require("../../common/pagination");
const BlogModel = require("../models/blog");
const transporter = require("../../common/transporter ");
const moment = require('moment');

const home = async (req, res) => {
  const featured = await ProductModel.find({
    featured: true,
    is_stock: true,
  })
    .sort({ _id: -1 })
    .limit(10);

  const blogs = await BlogModel.find().sort({ _id: 1 }).limit(3);
  const products = await ProductModel.find().limit(12).sort({ _id: -1 });
  const customers = await CustomerModel.find().limit(10).sort({ _id: -1 });

  res.render("site/index", { featured, blogs, products, customers });
};

const category = async (req, res) => {
  // const page = parseInt(req.query.page) || 1;
  // const limit = 10;
  // const skip = limit * page - limit;
  // const totalRows = await ProductModel.find().countDocuments();
  // const totalPages = Math.ceil(totalRows / limit);

  const id = req.params.id;
  const products = await ProductModel.find({ cat_id: id }).sort({ _id: -1 });
  // .populate({ path: "cat_id" })
  // .sort({ _id: -1 })
  // .skip(skip)
  // .limit(limit);
  const category = await CategoryModel.findById(id);

  // const next = page + 1;
  // const hasNext = page < totalPages ? true : false;
  // const prev = page - 1;
  // const hasPrev = page > 1 ? true : false;

  const title = category.title;
  const total = products.length;

  res.render("site/category", {
    title,
    total,
    products,
    // page,
    // totalPages,
    // next,
    // hasNext,
    // prev,
    // hasPrev,
    // pages: pagination(page, totalPages),
  });
};

const product = async (req, res) => {
  const id = req.params.id;
  const limit =4;
  const product = await ProductModel.findById(id);
  const comments = await CommentModel.find({ prd_id: id }).sort({ _id: -1 }).limit(limit);
  res.render("site/product", { product, comments });
};

const comment = async (req, res) => {
  const id = req.params.id;
  const { full_name, email, body } = req.body;
  const comment = {
    prd_id: id,
    full_name,
    email,
    body,
  };
  await new CommentModel(comment).save();
  res.redirect(req.path);
};

const shop = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const skip = limit * page - limit;
  const totalRows = await ProductModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);

  const products = await ProductModel.find({})
    .populate({ path: "cat_id" })
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit);

  // console.log(products);
  const next = page + 1;
  const hasNext = page < totalPages ? true : false;
  const prev = page - 1;
  const hasPrev = page > 1 ? true : false;

  const total = products.length;

  res.render("site/shop", {
    total,
    products,
    page,
    totalPages,
    next,
    hasNext,
    prev,
    hasPrev,
    pages: pagination(page, totalPages),
  });
};

const allBlog = async (req, res) => {
 
  // const blog = await BlogModel.findById(id);
  const blogs = await BlogModel.find().sort({ _id: 1 }).limit(6);
  res.render("site/allBlog", {blogs });
};

const blog = async (req, res) => {
  const id = req.params.id;
  const blog = await BlogModel.findById(id);
  res.render("site/blog", {blog});
};

// const blogDetail = async (req, res) => {
//   const id = req.params.id;
//   const blog = await BlogModel.findById(id);
//   // const blogs = await BlogModel.find();
//   const blogDisplay = await BlogModel.find().sort({ _id: -1 }).limit(3);
//   res.render("site/blogdetail", { blog, blogDisplay });
// };

const search = async (req, res) => {
  const keyword = req.query.keyword || "";
  const products = await ProductModel.find({
    $text: {
      $search: keyword,
    },
  });
  const total = products.length;
  // console.log(products);
  res.render("site/search", { products, keyword, total });
};

const addToCart = async (req, res) => {
  const items = req.session.cart;
  const { id, qty } = req.body;
  let isProductExist = false;

  items.map((item) => {
    if (item.id === id) {
      item.qty += parseInt(qty);
      isProductExist = true;
    }
    return item;
  });
  if (!isProductExist) {
    const product = await ProductModel.findById(id);
    items.push({
      id,
      name: product.name,
      thumbnail: product.thumbnail,
      price: product.price,
      qty: parseInt(qty),
    });
  }
  req.session.cart = items;
  res.redirect("/cart");
};

const cart = (req, res) => {
  const cart = req.session.cart;
  res.render("site/cart", { cart });
};

const updateCart = (req, res) => {
  const products = req.body.products;
  let items = req.session.cart;
  const newItems = items.map((item) => {
    item.qty = parseInt(products[item.id]["qty"]);
    return item;
  });
  req.session.cart = newItems;
  res.redirect("/cart");
};

const deleteCart = async (req, res) => {
  const { id } = req.params;
  let items = req.session.cart;
  const newItems = items.filter((item) => item.id != id);
  req.session.cart = newItems;

  res.redirect("/cart");
};

const order = async (req, res) => {
  const items = req.session.cart;
  const body = req.body;
  // Lấy ra đường dẫn đến thư mục views
  const viewPath = req.app.get("views");
  // Compile template EJS sang HTML để gửi mail cho khách hàng
  const html = await ejs.renderFile(
    path.join(viewPath, "site/email-order.ejs"),
    {
      name: body.name,
      phone: body.phone,
      mail: body.mail,
      add: body.add,
      totalPrice: 0,
      items,
    }
  );
  // Gửi mail
  await transporter.sendMail({
    from: '"daugoipurador.com" <boyquanduidaopho@gmail.com>', // sender address
    to: body.mail, // list of receivers
    subject: "Xác nhận đơn hàng từ daugoipurador.com", // Subject line
    html,
  });

  await transporter.sendMail({
    from: '"daugoipurador.com" <boyquanduidaopho@gmail.com>', // sender address
    to: "store@daugoipurador.com", // list of receivers
    subject: "Có đơn đặt hàng trên website daugoipurador.com", // Subject line
    html,
  });

  req.session.cart = [];
  res.redirect("success");
};

const success = (req, res) => {
  res.render("site/success");
};

const contact = (req, res) => {
  res.render("site/contact");
};

const about = (req, res) => {
  res.render("site/about");
};

const customer = (req, res) => {
  
  res.render("site/customer");
};

const chinhsachbaomat = (req, res) => {
  
  res.render("site/chinhsachbaomat");
};

const chinhsachdoitra = (req, res) => {
  
  res.render("site/chinhsachdoitra");
};

const chinhsachhoantien = (req, res) => {
  
  res.render("site/chinhsachhoantien");
};

const chinhsachvanchuyen = (req, res) => {
  
  res.render("site/chinhsachvanchuyen");
};

const coming_soon = (req, res) => {
  
  res.render("site/coming_soon");
};



// const createPaymentURL = async (req, res, next) => {
//   console.log("\n" + "nquanqphong debug req: " + JSON.stringify(req.body) + "\n");

//   process.env.TZ = 'Asia/Ho_Chi_Minh';
    
//   let date = new Date();
//   let createDate = moment(date).format('YYYYMMDDHHmmss');
  
//   // let ipAddr = req.headers['x-forwarded-for'] ||
//   //     req.connection.remoteAddress ||
//   //     req.socket.remoteAddress ||
//   //     req.connection.socket.remoteAddress;

//   let config = require('config');
  
//   let tmnCode = config.get('vnp_TmnCode');
//   let secretKey = config.get('vnp_HashSecret');
//   let vnpUrl = config.get('vnp_Url');
//   let returnUrl = config.get('vnp_ReturnUrl');
//   let orderId = moment(date).format('DDHHmmss');
//   let amount = req.body.amount;
//   // let bankCode = req.body.bankCode;

//   let bankCode = "NCB";
//   let ipAddr = "13.160.92.202";
  
//   let locale = req.body.language;
//   if(locale === null || locale === ''){
//       locale = 'vn';
//   }
//   locale = "vn";

//   let currCode = 'VND';
//   let vnp_Params = {};
//   vnp_Params['vnp_Version'] = '2.1.0';
//   vnp_Params['vnp_Command'] = 'pay';
//   vnp_Params['vnp_TmnCode'] = tmnCode;
//   vnp_Params['vnp_Locale'] = locale;
//   vnp_Params['vnp_CurrCode'] = currCode;
//   vnp_Params['vnp_TxnRef'] = orderId;
//   vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
//   vnp_Params['vnp_OrderType'] = 'other';
//   vnp_Params['vnp_Amount'] = amount * 100;
//   vnp_Params['vnp_ReturnUrl'] = returnUrl;
//   vnp_Params['vnp_IpAddr'] = ipAddr;
//   vnp_Params['vnp_CreateDate'] = createDate;
//   if(bankCode !== null && bankCode !== ''){
//       vnp_Params['vnp_BankCode'] = bankCode;
//   }

//   vnp_Params = sortObject(vnp_Params);

//   let querystring = require('qs');
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   let crypto = require("crypto");     
//   let hmac = crypto.createHmac("sha512", secretKey);
//   let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
//   vnp_Params['vnp_SecureHash'] = signed;
//   vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

//   console.log("\n" + "nquanqphong debug: " + vnpUrl + "\n");

//   const items = req.session.cart;
//   const body = req.body;
//   // Lấy ra đường dẫn đến thư mục views
//   const viewPath = req.app.get("views");
//   // Compile template EJS sang HTML để gửi mail cho khách hàng
//   const html = await ejs.renderFile(
//     path.join(viewPath, "site/email-order.ejs"),
//     {
//       name: body.name,
//       phone: body.phone,
//       mail: body.mail,
//       add: body.add,
//       totalPrice: 0,
//       items,
//     }
//   );
//   // Gửi mail
//   await transporter.sendMail({
//     from: '"daugoipurador.com" <boyquanduidaopho@gmail.com>', // sender address
//     to: body.mail, // list of receivers
//     subject: "Xác nhận đơn hàng từ daugoipurador.com", // Subject line
//     html,
//   });

//   req.session.cart = [];

//   res.redirect(vnpUrl)
// };

// const vnpayReturn = (req, res, next) => {
// let vnp_Params = req.query;

//   let secureHash = vnp_Params['vnp_SecureHash'];

//   delete vnp_Params['vnp_SecureHash'];
//   delete vnp_Params['vnp_SecureHashType'];

//   vnp_Params = sortObject(vnp_Params);

//   let config = require('config');
//   let tmnCode = config.get('vnp_TmnCode');
//   let secretKey = config.get('vnp_HashSecret');

//   let querystring = require('qs');
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   let crypto = require("crypto");     
//   let hmac = crypto.createHmac("sha512", secretKey);
//   let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

//   if(secureHash === signed){
//       //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

//       res.render('site/success', {code: vnp_Params['vnp_ResponseCode']})
//   } else{
//       res.render('site/success', {code: '97'})
//   }
// }

//   // sortObject
//   function sortObject(obj) {
//     let sorted = {};
//     let str = [];
//     let key;
//     for (key in obj){
//       if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//       }
//     }
//     str.sort();
//       for (key = 0; key < str.length; key++) {
//           sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//       }
//       return sorted;
//   }

module.exports = {
  home,
  category,
  product,
  comment,
  shop,
  blog,
  allBlog,
  search,
  addToCart,
  cart,
  updateCart,
  deleteCart,
  order,
  success,
  contact,
  about,
  customer,
  chinhsachbaomat,
  chinhsachdoitra,
  chinhsachhoantien,
  chinhsachvanchuyen,
  coming_soon,
  // catedetail,
  // createPaymentURL,
  // vnpayReturn
};
