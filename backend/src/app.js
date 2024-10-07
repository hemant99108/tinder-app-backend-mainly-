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







connectDB().then(()=>{
    console.log('datbase connection established');
    app.listen(3000,()=>console.log('listening on port 3000'));    
}).catch((error)=>{
    console.log('error  is',error);
})  
 
 




