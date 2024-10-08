const validator=require('validator');

const validateSignupData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName||!lastName||!emailId||!password){
        throw new Error('Please enter all required fields');
    }

    if(!validator.isEmail(emailId)){
        throw new Error('Please enter a valid email');
    }
    if(!validator.isStrongPassword(password)){
        throw new Error('Password should be at least 8 characters long and contain a combination of uppercase letters, lowercase letters, numbers, and special characters');
    }

}

const validateloginData=(req)=>{
    const { emailId,password}=req.body;

    if( !emailId||!password){
        throw new Error('Please enter emailid and password  fields');
    }

    if(!validator.isEmail(emailId)){
        throw new Error('Please enter a valid email');
    }
     

}




module.exports={
    validateSignupData,validateloginData,
}