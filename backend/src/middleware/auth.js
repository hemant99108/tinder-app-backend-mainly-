

  const adminauth =(req,res,next) => {
    console.log("admin auth  is checked");
    const token="xyz";

    const isadmin=token==='xyz';

    if(isadmin){
        next();
    }else{
        res.status(401).json({message:'Unauthorized access'});
    }
 
}


module.exports={
    adminauth
    
}