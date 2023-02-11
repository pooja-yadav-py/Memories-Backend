

const express = require('express');
const app = express();
var cors = require('cors')
const mongoose = require('mongoose')
require('./Userinfo');
app.use(express.json());
app.use(cors())
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRFT = "ajsdhsjhdbn32849447znmsdjashd@#jshjfjjksdh4384375";

//connected to database with nodejs
const mongoURL = "mongodb+srv://poojayadav:8209792612@cluster0.zkygdik.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURL,{
    useNewUrlParser:true
}).then(()=>{console.log("Connected to database")})
.catch(e=>console.log(e)) 

const User = mongoose.model('Userinfo');




app.post('/resister',async(req,res)=>{
    const {username,email,password,gender} = req.body
    const encryptedPassword = await bcrypt.hash(password,10)
    try{
        const oldUser = await User.findOne({ email });
        if(oldUser){
            return res.json({error:"User Exists"});
        }
        await User.create({
            uname:username,
            email,
            password:encryptedPassword,
            gender,
        })
        res.send({status:"you are Resistor successfully"})
    }catch(error){
        console.log(error)
        res.send({status:"error"})
        
    }
})

app.post("/loginuser",async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.json({error:"User not Exist"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({email:user.email},JWT_SECRFT)
        if(res.status(201)){
            return res.json({status:"ok",data:token});
        }else{
            return res.json({status:"error"})
        }
    }
    res.json({status:"error",error:"Invalid Password"});
})


app.post("/userData", async(req,res)=>{
    const {token} = req.body;
    try{
      const user = jwt.verify(token,JWT_SECRFT);
      console.log("pp",user)
      const useremail = user.email;
      User.findOne({ email: useremail })      
      .then((data) =>{
          console.log("data",data)
          res.send({status:"ok",data:data});
      }).catch((error)=>{
        res.send({status:"error", data:error});
    })  
    }catch(e){
        console.log(e)
        res.send({status:e})
    }
        
    
})

const server = app.listen(5000,()=>{
    console.log('Server Started');
});