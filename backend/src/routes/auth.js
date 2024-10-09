const express=require('express');
const bcrypt = require('bcrypt');
const authRouter=express.Router();
const User=require('../models/user');
const { validateSignupData, validateloginData } = require('../utils/validation');




authRouter.post("/signup", async (req, res) => {
    try {
      //validate the signup data
      validateSignupData(req);
      //encrypt the password
      const { password } = req.body;
      const hashedpassword = await bcrypt.hash(password, 10);
      console.log(hashedpassword);
  
      const { firstName, lastName, emailId } = req.body;
  
      //then create the instance of the User schema and save it to the database
      const allProfilePic=`https://i.pravatar.cc/150?u=${firstName}`;

      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedpassword,
        photoURL:allProfilePic
      });
      await user.save();
      res.send("user saved successfully");
    } catch (error) {
      res.status(500).send("error in signup: " + error.message);
    }
  });


  authRouter.post("/login", async (req, res) => {
    try {
      validateloginData(req);
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Invalid credentials ");
      }
  
      const validated = await user.validatePassword(password);
  
      if (validated) {
        //after validation
       
        const token =await user.getJWT();       
  
        //add the token to cookie and send it back to the browser
  
        res.cookie("token", token,{expires: new Date(Date.now()+8*3600000)});
  
        res.send("logged in successfully");
      } else {
        throw new Error("try another password");
      }
    } catch (error) {
      res.status(500).send("error in login api : " + error.message);
    }
  });


  authRouter.post('/logout',async(req,res)=>{
    res.cookie('token',null,{expires:new Date(Date.now())});
  
    res.send('Logged out successfully');            
  })


module.exports=authRouter;