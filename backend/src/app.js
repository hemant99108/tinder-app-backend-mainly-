const express   = require('express');

const {connectDB}=require('./config/database');
const User=require('./models/user');


const app = express();
app.use(express.json());


app.post("/signup",async(req,res)=>{
    const user=new User(req.body);

    try {
        await user.save(); 
        res.send('user saved successfully');
    } catch (error) {
        res.status(500).send('error saving user');
    }

    
});


app.get('/feed',async(req,res)=>{


    try {
        const users=await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send('error fetching user collection');
    }
})

app.get('/user',async(req,res)=>{
    const useremail=req.body.email;

    try {
        const user=await User.find({emailId:useremail});

        if(!user){
            res.status(404).json({message:'user not found'});
        }
        else{
            res.send(user);
        }
    } catch (error) {
        res.status(500).send("user with email does not exists");
    }
})


app.delete('/user',async(req,res)=>{
    const{ userid,email}=req.body;

    try {
        await User.findOneAndDelete(userid);                                            
        console.log("user deletion successfully completed");
        res.send('user deleted successfully');
    } catch (error) {
        console.log('error while deletion of the user');
        res.status(500).send("user with emailId  does not exists");
    }
});

app.patch('/user',async(req,res)=>{
    const {userid}=req.body; 
    const data=req.body;
    
    try {
        
        const user=await User.findByIdAndUpdate(userid,data,{returnDocumnent:'before'});
        await user.save();

        res.send(user);
        console.log('user updated successfully',user);

    }
    catch (error) {
        res.status(500).send("Error updating user");
        console.log('error updating user');
    }
})



connectDB().then(()=>{
    console.log('datbase connection established');
    app.listen(3000,()=>console.log('listening on port 3000'));    
}).catch((error)=>{
    console.log('error  is',error);
})  
 
 




