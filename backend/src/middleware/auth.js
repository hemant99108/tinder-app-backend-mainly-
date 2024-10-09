const jwt =require('jsonwebtoken');
const User=require('../models/user');

 const userauth=async(req,res,next)=>{
   try {
     //read the token from req.cookies 
     const {token}=req.cookies;
     //verify the token
     const decoded=await jwt.verify(token,'secretkey');
 
     const {_id}=decoded;
 
     const user=await User.findById(_id);
     console.log(user);
     if(!user){
         throw new Error('User not found');
     }
     //attach the user to the request object 
     req.user=user;

     
     next();

   } catch (error) {
    res.status(404).send('error: '+error.message);
   }

 }





module.exports={
   
    userauth,
}