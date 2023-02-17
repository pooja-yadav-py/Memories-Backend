const mongoose= require('mongoose');


const UserDetailsSchema = new mongoose.Schema(
    {
        uname:String,
        email:{type:String,unique:true},
        password:String,
        gender:String,
    },{
        collection:"Userinfo"   ,
    }
);

const User = mongoose.model("Userinfo",UserDetailsSchema);
module.exports = User;