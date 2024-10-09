const express=require('express');
const { userauth } = require('../middleware/auth');


const requestRouter=express.Router();

requestRouter.post('/sendConnectionRequest',userauth,async(req,res)=>{

    const user=req.user;

    //sending the connection request
    console.log('sending connection request');

    res.send(user.firstName+"sent the connection request");


})



module.exports=requestRouter;