const mongoose=require('mongoose');

const reviewSchema=mongoose.Schema({
    comment:{type:String,required:true},
    rating:{type:Number,required:true},
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }
},{timestamps:true});

const Reviews=mongoose.model('Review',reviewSchema);
module.exports=Reviews;