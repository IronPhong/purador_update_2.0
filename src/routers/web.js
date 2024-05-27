const express = require("express");
const { route } = require("../apps/app");

const router = express.Router();
// Admin Controller
const AuthController = require("../apps/controllers/auth");
const AdminController = require("../apps/controllers/admin");
const ProductController = require("../apps/controllers/product");
const UserController = require("../apps/controllers/user");
const CommentController = require("../apps/controllers/comment");
const BlogController = require("../apps/controllers/blog");

// Site Controller
const SiteController = require("../apps/controllers/site");

//  Middleware
const AuthMiddleware = require("../apps/middlewares/auth");
const UploadMiddleware = require("../apps/middlewares/upload");

// Test
const TestController = require("../apps/controllers/test");
router.get("/test", TestController.test);
router.get("/testform", TestController.testForm);
router.post("/testform", TestController.actionForm);

// Router Admin

router.get("/admin/login", AuthMiddleware.checkLogin, AuthController.getLogin);
router.post(
  "/admin/login",
  AuthMiddleware.checkLogin,
  AuthController.postLogin
);
router.get("/admin/logout", AuthMiddleware.checkAdmin, AuthController.logout);

router.get(
  "/admin/dashboard",
  AuthMiddleware.checkAdmin,
  AdminController.index
);
router.get(
  "/admin/products",
  AuthMiddleware.checkAdmin,
  ProductController.index
);
router.get(
  "/admin/products/create",
  AuthMiddleware.checkAdmin,
  ProductController.create
);
router.post(
  "/admin/products/store",
  UploadMiddleware.single("thumbnail"),
  AuthMiddleware.checkAdmin,
  ProductController.store
);
router.get(
  "/admin/products/edit/:id",
  AuthMiddleware.checkAdmin,
  ProductController.edit
);
router.post(
  "/admin/products/update/:id",
  UploadMiddleware.single("thumbnail"),
  AuthMiddleware.checkAdmin,
  ProductController.update
);
router.get(
  "/admin/products/delete/:id",
  AuthMiddleware.checkAdmin,
  ProductController.del
);

// Router Admin User
router.get(
  "/admin/users/create",
  AuthMiddleware.checkAdmin,
  UserController.create
);
router.post(
  "/admin/users/store",
  AuthMiddleware.checkAdmin,
  UserController.store
);
router.get(
  "/admin/users",
  AuthMiddleware.checkAdmin,
  UserController.user
);
router.get(
  "/admin/users/edit/:id",
  AuthMiddleware.checkAdmin,
  UserController.edit
);
router.post(
  "/admin/users/update/:id",
  AuthMiddleware.checkAdmin,
  UserController.update
);
router.get(
  "/admin/users/delete/:id",
  AuthMiddleware.checkAdmin,
  UserController.del
);

// Router Admin Comments
router.get(
  "/admin/comments",
  AuthMiddleware.checkAdmin,
  CommentController.comment
);
router.get(
  "/admin/comments/delete/:id",
  AuthMiddleware.checkAdmin,
  CommentController.del
);

// Router Admin Blogs
router.get(
  "/admin/blogs",
  AuthMiddleware.checkAdmin,
  BlogController.index
);
router.get(
  "/admin/blogs/create",
  AuthMiddleware.checkAdmin,
  BlogController.create
);
router.post(
  "/admin/blogs/store",
  UploadMiddleware.single("thumbnail"),
  AuthMiddleware.checkAdmin,
  BlogController.store
);
router.get(
  "/admin/blogs/edit/:id",
  AuthMiddleware.checkAdmin,
  BlogController.edit
);
router.post(
  "/admin/blogs/update/:id",
  UploadMiddleware.single("thumbnail"),
  AuthMiddleware.checkAdmin,
  BlogController.update
);
router.get(
  "/admin/blogs/delete/:id",
  AuthMiddleware.checkAdmin,
  BlogController.del
);


// Router Category
const CategoryController = require("../apps/controllers/category");

router.get(
  "/admin/categories",
  AuthMiddleware.checkAdmin, 
  CategoryController.category
);
router.get(
  "/admin/categories/create",
  AuthMiddleware.checkAdmin,
  CategoryController.create
);
// router.post(
//   "/admin/categories/store",
//   UploadMiddleware.single("thumbnail"),
//   AuthMiddleware.checkAdmin,
//   CategoryController.store
// );

// Router Chính sách
router.get("/chinhsachbaomat", SiteController.chinhsachbaomat);
router.get("/chinhsachdoitra", SiteController.chinhsachdoitra);
router.get("/chinhsachhoantien", SiteController.chinhsachhoantien);
router.get("/chinhsachvanchuyen", SiteController.chinhsachvanchuyen);

// Router Site
router.get("/", SiteController.home);
router.get("/category-:slug.:id", SiteController.category);
router.get("/product-:slug.:id", SiteController.product);
router.post("/product-:slug.:id", SiteController.comment);

router.get("/blog", SiteController.blog);
router.get("/allBlog", SiteController.allBlog);
router.get("/blog-:slug.:id", SiteController.blog);
router.get("/shop", SiteController.shop);
router.get("/search", SiteController.search);

router.get("/cart", SiteController.cart);
router.post("/add-to-cart", SiteController.addToCart);
router.post("/update-cart", SiteController.updateCart);
router.get("/delete-cart-:id", SiteController.deleteCart);

router.post("/order", SiteController.order);

router.get("/success", SiteController.success);
router.get("/contact", SiteController.contact);
router.get("/about", SiteController.about);
router.get("/coming_soon", SiteController.coming_soon);

// router.post("/create_payment_url", SiteController.createPaymentURL);
// router.get("/vnpay_return", SiteController.vnpayReturn);


module.exports = router;
