const express=require('express');
const { userauth } = require('../middleware/auth');
const ConnectionRequest  = require('../models/connectionRequest');
const User = require('../models/user');


const requestRouter=express.Router();

//this api is only for sending interested or ignored requests
requestRouter.post('/send/:status/:toUserId',userauth,async(req,res)=>{

    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=['interested','ignored'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:'invalid status'+status,
                data:null, 
            })
        }

        const touser=await User.findById(toUserId);
        if(!touser){
            return res.status(404).json({
                message:'to user not found',
                data:null,
            })
        }

        const checkIfExists=await ConnectionRequest.findOne({
           $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
           ]
        });

        if(checkIfExists){
            return res.status(400).json({
                message:'request already sent',
                data:null,
            })
        }

        const connectionreq=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

       const data= await connectionreq.save();

       res.send({
        message: req.user.firstName + ' is '+status+" in "+touser.firstName,
        data:data,
       })




    } catch(error) {
        res.status(400).send("error in request router: "+error.message);
    }


});

//this api only works for the interested connection requests   
requestRouter.post('/review/:status/:requestId',userauth,async(req,res)=>{
    try {
        const loggedInUser =req.user;

        const {status,requestId}=req.params;

        const allowedStatus=['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:'status must be one  of ' + allowedStatus,
                data:null,
            })
        }

        //find the connection request with the id  touser will be logged in user 

        const connectionRequest=await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status:'interested'
        });

        if(!connectionRequest){
            return res.status(404).json({
                message:'connection request not found',
                data:null,
            })
        }

        //found then chage the status 
        connectionRequest.status=status;
        const data= await connectionRequest.save();


        res.status(200).json({
            message: 'connection request :'+status,
            data: data,
        })


    } catch (error) {
        res.send('error in review request :'+error.message);
    }
});




requestRouter.get('/feed',async(req,res)=>{
    const data=await ConnectionRequest.find({});

    res.status(200).send(data);
})


module.exports=requestRouter;