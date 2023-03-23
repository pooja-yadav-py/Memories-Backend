const mongoose= require('mongoose');


const UserDetailsSchema = new mongoose.Schema(
    {
        uname:String,
        email:{type:String,unique:true,required: true},
        password:String,
        gender:String,
        isAdmin:{ type: Boolean, default: false },
    },{
        collection:"Userinfo"   ,
    }
);

const User = mongoose.model("Userinfo",UserDetailsSchema);
module.exports = User;