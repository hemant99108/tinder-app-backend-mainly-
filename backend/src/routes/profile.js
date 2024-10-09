const express=require('express');
const User=require('../models/user');
const { userauth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');

const profileRouter=express.Router();

profileRouter.get("/view",userauth, async (req, res) => {
    try {
      const user=req.user;
      if(!user){
        throw new Error("user not found");
      }
      res.send(user);
       
    } catch (error) {
      res.status(401).send("Unauthorized  "+error.message);
    }
  });


  profileRouter.patch('/edit',userauth,async(req,res)=>{

    try {

      if(!validateEditProfileData(req)){
        throw new Error("Invalid profile data to update");
      }

      const loggedinuser=req.user;
       
      Object.keys(req.body).forEach((key)=>(loggedinuser[key]=req.body[key]));

      await loggedinuser.save();

      

      res.send(`${loggedinuser.firstName}, your profile  updated successfully`);
      
    }   catch (error) {
        res.status(401).send("Error:  "+error.message);
    }

  })



module.exports=profileRouter;