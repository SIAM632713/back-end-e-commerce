const express = require('express')
const orderModel = require("../orders/order.model")
const Products=require('../products/product.model')
const Reviews=require('../reviews/review.model')
const UserModel = require("../users/user.model");
const router = express.Router()


router.get('/admin-state',async (req,res)=>{
    try{
        const totalOrders=await orderModel.countDocuments()

        const totalProducts=await Products.countDocuments()

        const totalReviews=await Reviews.countDocuments()

        const totalUsers=await UserModel.countDocuments()

        const totalEarningResult=await orderModel.aggregate([
            {
                $group:{
                    _id:null,
                    totalEarning:{$sum:"$amount"}
                }
            }
        ])

        const totalEarning=totalEarningResult.length > 0 ? totalEarningResult[0].totalEarning : 0

        const monthlyEarningResult=await orderModel.aggregate([
            {
                $group:{
                    _id:{month:{$month:"$createdAt"}, year:{$year:"$createdAt"}},
                    monthlyEarning:{$sum:"$amount"}
                },
            },
            {
                $sort:{"_id.year":1,"_id.month":1}
            }
        ])

        const monthlyEarnings=monthlyEarningResult.map(entry=>({
            month:entry._id.month,
            year:entry._id.year,
            earnings:entry.monthlyEarning,
        }))

        res.status(200).json({
            totalOrders,
            totalProducts,
            totalReviews,
            totalUsers,
            totalEarning,
            monthlyEarnings,
        })
    }catch(err){
        res.status(500).json({message:"Failed to fetch admin state"})
    }
})



router.get('/user-state/:email',async (req,res)=>{
    const {email}=req.params;
    try {
        const user=await UserModel.findOne({email:email});
        if(!user){
           return  res.status(404).json({message:"User not found"})
        }

        const totalPaymentresult=await orderModel.aggregate([
            {
                $match:{email:email}
            },
            {$group:{_id:null,totalAmount:{$sum:"$amount"}}}
        ])

        const totalPaymentamount=totalPaymentresult.length > 0 ? totalPaymentresult[0].totalAmount : 0;

        const totalReviews=await Reviews.countDocuments({userID:user._id})

        const purchaseProductID=await orderModel.distinct("products.productID",{email:email})
       const totalpurchaseProducts=purchaseProductID.length;

     res.status(200).json({
         totalPaymentamount,
         totalReviews,
         totalpurchaseProducts
     })
    }catch(err){
     res.status(500).json({message:"Failed to fetch user state"})
    }
})

module.exports = router