const UserModel=require('../users/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET_KEY

const generateToken=async (userId)=>{
    try{
        const user=await UserModel.findById(userId);
        if(!user){
            throw  new Error('User not found');
        }
        const token=jwt.sign({userID:user._id,role:user.role},JWT_SECRET,{expiresIn:'72h'});
        return token;
    }catch(err){
      console.log(err);
      throw err;
    }
}

module.exports = generateToken;

