const express = require("express");
 const app = express();
 const mongoose = require("mongoose");
 const dotenv = require("dotenv");
 const userRoute = require("./routes/user")
 const authRoute = require("./routes/auth")
 const productRoute = require("./routes/product")
 const cartRoute = require("./routes/cart")
 const orderRoute = require("./routes/order")
 const checkoutRoute = require("./routes/stripe")
 const cors = require("cors");

 dotenv.config();
 mongoose.set('strictQuery', true);

 mongoose.connect(process.env.MONGO_URI).then(()=>console.log("DB Connected successfully")).catch((err)=>{
    console.log(err);
 });
 
 
 app.use(express.json())

 //app.use(cors({ origin: 'http://localhost:3001' }));
 app.use(cors({
   origin: '*',
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   credentials: true
 }));
 app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


 app.use("/api/auth", authRoute)
 app.use("/api/users", userRoute)
 app.use("/api/products", productRoute)
 app.use("/api/carts", cartRoute)
 app.use("/api/orders", orderRoute)
 app.use("/api/checkout", checkoutRoute)


 app.listen(process.env.PORT || 5000, () =>{
    console.log("Backend server is running ")
 })