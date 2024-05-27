require("dotenv").config();

module.exports = {
  app: {
    port: process.env.SERVER_PORT || 8000,
    static_folder: `${__dirname}/../src/public`,
    router: `${__dirname}/../src/routers/web`,
    view_folder: `${__dirname}/../src/apps/views`,
    view_engine: "ejs",
    session_key: "Vietpro_session",
  },
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "daugoipuradorvn@gmail.com",
      pass: "tjmp rfiw ssnj doks",
    },
  },
  "vnp_TmnCode": "SROA19P6",
  "vnp_HashSecret": "PUTPSQFIKGPUDYOCZKOSLJTFGVTUTVOJ",
  "vnp_Url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  "vnp_Api": "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  "vnp_ReturnUrl": "http://localhost:8000/vnpay_return",
};
