const express=require('express');
const { userauth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter=express.Router();

const SAFE_TO_POPULATE="firstName lastName photoURL age gender about skills";
//get all pending requests for the logged in user
userRouter.get('/requests/recieved',userauth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        //get only pending not accepted requests means interested requests
        const connectionRequests=await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested',
        }).populate("fromUserId",SAFE_TO_POPULATE);


        res.status(200).json({
            message: 'all pending requests',
            data: connectionRequests,
        })

    } catch (error) {
        res.status(400).send('error in user router: '+error.message);
    }
})


//get all the accepted requests for the logged in user
userRouter.get('/connections',userauth,async(req,res)=>{
    try {
        const loggedInUser=req.user;

        //loggedinuser can be a sender or also a reciever 
        const connections=await ConnectionRequest.find({
            $or: [
                {fromUserId:loggedInUser._id , status:"accepted"},
                {toUserId:loggedInUser._id , status:"accepted"},
            ]
        }).populate("fromUserId toUserId",SAFE_TO_POPULATE);

        const data=connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.status(200).json({
            message: 'all accepted connections',
            data: data,
        });

    } catch (error) {
        res.status(400).send('error in user router: '+error.message);
    }
})

//feed page for a customer
userRouter.get('/feed',userauth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;

        limit=limit>50?50:limit;

        const skip=(page-1)*limit;

        //find all connections (sent+recieved)
        const connections=await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ]
        }).select('fromUserId toUserId');

        const hideFromUser = new Set();
        connections.forEach((req)=>{
            hideFromUser.add(req.fromUserId.toString());
            hideFromUser.add(req.toUserId.toString());
        });


        const users=await User.find({
            $and:[
                {_id:{$nin: Array.from(hideFromUser)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select(SAFE_TO_POPULATE).skip(skip).limit(limit);

        res.status(200).json({
            message: 'feed data',
            data: users,
        })                                                          


    } catch (error) {
        res.status(400).json({
            message:"error in user/feed : "+error.message,
            data: null,
        })
    }
})


module.exports=userRouter;