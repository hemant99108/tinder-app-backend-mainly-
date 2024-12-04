const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const cors=require('cors');
 
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3002'], // replace with your frontend URL
  credentials: true, // allow session cookies from browser to pass through
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'] // allow these methods
}))
  
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
