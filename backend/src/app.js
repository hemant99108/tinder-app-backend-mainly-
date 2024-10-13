const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
 
const app = express();
app.use(express.json());
app.use(cookieParser());
  
const authRouter=require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter=require('./routes/user');


app.use('/',authRouter);
app.use('/profile',profileRouter);
app.use('/request',requestRouter);
app.use('/user',userRouter);


connectDB()
  .then(() => {
    console.log("datbase connection established");
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch((error) => {
    console.log("error  is", error);
  });
