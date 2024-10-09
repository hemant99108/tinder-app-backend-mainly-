const mongoose=require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator=require('validator');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address'+value);
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate:(value)=>{
            if(!['male','female','other'].includes(value.toLowerCase())){
                throw new Error('Gender from either male or female or other');
            }
        }
    },
    photoURL:{
        type:String,
        default:'https://www.gravatar.com/avatar?d=identicon',
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error('Invalid image url  address'+value);
            }
        }
    },
    about:{
        type:String,
        default:'default text for about users'
    },
    skills:{
        type:[String],
         
    }
},{timestamps:true});


userSchema.methods.getJWT=async function(){
    const user=this;

    const token= await jwt.sign({ _id: user._id }, "secretkey",{expiresIn:'7d'});

    return token;
}

userSchema.methods.validatePassword=async function(passwordInputbyuser){
    const user=this;

    const hashedpassword=user.password;

    const ispassvalid=await bcrypt.compare(passwordInputbyuser, hashedpassword);


    return ispassvalid;
}

const userModel=mongoose.model('User',userSchema);

module.exports=userModel;