const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    name:{type:String,required:true},
    category:{type:String},
    description:{type:String},
    price:{type:Number,required:true},
    oldPrice:{type:Number},
    image:{type:String,required:true},
    color:{type:String},
    rating:{type:Number,default:0},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

const Products=mongoose.model('Product',productSchema);
module.exports=Products;