const mongoose = require('mongoose');
const {model} = require("mongoose");
const bcrypt=require('bcrypt');

const UserSchema=new mongoose.Schema({
    username: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    profileImage:String,
    bio: { type: String, maxLength: 200 },
    profession:String,
    role:{
        type:String,
        default:'user'
    },
    createdAt:{type:Date,default:Date.now}
})

UserSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password'))return next();
    const hashPassword=await bcrypt.hash(user.password, 10);
    user.password=hashPassword;
    next();
})

UserSchema.methods.comparePassword=function (candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
}

const UserModel=model('User',UserSchema);
module.exports=UserModel;