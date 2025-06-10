const Reviews=require('./review.model')
const Products=require('../products/product.model')

const postAReview=async(req,res)=>{
    try{
        const{comment,rating,userID,productID}=req.body;

        if(!comment || !userID || rating === undefined || !productID){
            res.status(400).send({message:"Missing required fields"});
        }

        const existingReview=await Reviews.findOne({productID,userID})
        if(existingReview){
            existingReview.rating=rating;
            existingReview.comment=comment;
            await existingReview.save();
        }else {
            const review=new Reviews({comment,rating,userID,productID})
            await review.save();
        }
        const reviews=await Reviews.find({productID}).sort({updatedAt:-1});

        if(reviews.length>0){
            const totalReviews=reviews.reduce((acc,review)=>acc+review.rating,0);
            const averageRating=totalReviews/reviews.length;

            const product=await Products.findById(productID);

            if(product){
                product.rating=averageRating;
                await product.save({validateBeforeSave:false});
            }else {
                res.status(400).send({message:"Missing required fields",data:Reviews});
            }
        }
        res.status(200).send({message:"Reviews posted successfully"});
    }catch(err){
     console.error(err);
     res.status(400).send({message:"Missing required fields"});
    }
}



const getReviews=async(req,res)=>{
    const {userID} = req.params;
    try{
        const reviews=await Reviews.find({userID:userID}).sort({createdAt:-1});
        if(reviews.length===0){
           return  res.status(404).send({message:"No reviews found for this user"});
        }
        res.status(200).send({message:"Reviews finded successfully",data:reviews});
    }catch (e){
     console.error(e);
     res.status(400).send({message:"No reviews found for this user"});
    }
}


const countReviews=async(req,res)=>{
    try{
        const totalReview=await Reviews.countDocuments({})
        res.status(200).send({message:"Reviews count successfully",data:totalReview});
    }catch(err){
        console.error(err);
        res.status(400).send({message:"Reviews count failed"});
    }
}

module.exports={postAReview,getReviews,countReviews}