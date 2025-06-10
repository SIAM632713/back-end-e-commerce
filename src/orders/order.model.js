const mongoose = require('mongoose');

const orderSchema=mongoose.Schema({
    userID:String,
    orderID:String,
    products:[
        {
            productID:{type:String,required: true},
            quantity:{type:Number,required: true},
        }
    ],
    email:{type:String,required: true},
    amount:Number,
    status:{
        type:String,
        enum:["pending","processing","shipped","completed"],
        default:'pending'
    }
},{ timestamps: true });

const orderModel=mongoose.model('Order',orderSchema);
module.exports = orderModel;