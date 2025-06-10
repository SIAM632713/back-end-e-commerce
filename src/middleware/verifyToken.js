const jwt=require('jsonwebtoken')

const JWT_SECRET=process.env.JWT_SECRET_KEY;

const verifyToken=(req, res, next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return  res.status(401).json({message:"Unauthorized Accesss!"});
        }
        const decodedToken=jwt.verify(token,JWT_SECRET);
        if(!decodedToken.userID){
            return res.status(401).json({message:"Unauthorized Accesss!"});
        }
        req.userID=decodedToken.userID;
        req.role=decodedToken.role;
        next();
    }catch (e){
        return res.status(401).json({message:"Invalid Token!"});
    }
}

module.exports=verifyToken;