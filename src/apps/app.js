const express = require("express");
const session = require("express-session");
const config = require("config");
const app = express();

// Config View
app.set("views", config.get("app.view_folder"));
app.set("view engine", config.get("app.view_engine"));

app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(config.get("app.static_folder")));

// Config session

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Create Cart
app.use(require("./middlewares/cart"));
app.use(require("./middlewares/share"));

// Router
app.use(require(config.get("app.router")));

module.exports = app;
