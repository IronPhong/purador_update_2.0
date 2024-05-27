const mongoose = require("../../common/database")();

const customerSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
    },
    ava:{
        type: String,
        default: null,
    },
    role:{
        type: String,
    },
    comment:{
        type: String,
    },

  },
  {
    timestamps: true,
  }
);

const CustomerModel = mongoose.model("Customers", customerSchema, "customers");
module.exports = CustomerModel;
