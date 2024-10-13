const mongoose=require('mongoose');
 
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
        
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enums:{
            values:['ignore','interested','accepted','rejected'],
            messages:` {VALUE} is not a  status type`
        }
        
    }
},{timestamps:true});


connectionRequestSchema.index({fromUserId:1,toUserId:1 });

connectionRequestSchema.pre('save',function(next){
    const currentconnection=this;

    if(currentconnection.toUserId.equals(currentconnection.fromUserId)){
        throw new Error('cant sent request to self');
    }

    next();
})


const ConnectionRequestModel=mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports=ConnectionRequestModel;