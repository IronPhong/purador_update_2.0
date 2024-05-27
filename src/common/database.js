const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Connected!"));
  return mongoose;
};
