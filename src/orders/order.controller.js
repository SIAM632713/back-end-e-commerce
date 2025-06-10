const {baseURL} = require("../utilitis/baseURL");
const orderModel=require('./order.model')
const stripe=require('stripe')(process.env.STRUPE_SECRET_KEY);

const mekePaymentRequest=async(req,res)=>{
    const {products,userID} = req.body;
    try{
        const lineItems=products.map((product)=>({
            price_data:{
                currency:'usd',
                product_data:{
                    name:product.name,
                    images:[product.image]
                },
                unit_amount:Math.round(product.price*100),
            },
            quantity:product.quantity,
        }));

        const session=await stripe.checkout.sessions.create({
            line_items:lineItems,
            payment_method_types:['card'],
            mode:'payment',
            success_url: `${baseURL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseURL}/cancel`,
        })
        res.json({id:session.id})
    }catch(err){
        res.status(400).json({message:"Something went wrong"});
    }
}

const confirmPayment=async (req,res)=>{
    const {session_id}=req.body;
    try {
        const session=await stripe.checkout.sessions.retrieve(session_id,{
            expand:["line_items","payment_intent"]
        })
        console.log(session)
        const paymentIntentId=session.payment_intent.id
        let order=await orderModel.findOne({orderID:paymentIntentId})

        if(!order){
            const lineItems=session.line_items.data.map((item)=>({
                productID:item.price.product,
                quantity:item.quantity,
            }))
            const amount=session.amount_total/100;

            order=new orderModel({
                orderID:paymentIntentId,
                products:lineItems,
                amount:amount,
                email:session.customer_details.email,
                status:session.payment_intent.status === "succeeded" ? "pending" : "failed"
            })
        }else {
            order.status=session.payment_intent.status === "succeeded" ? "pending" : "failed"
        }
        await order.save();
        res.status(200).json({message:"Payment successful",data:order})
    }catch(err){
      res.status(400).json({message:"Failed to confirmed payment"});
    }
}


const getOrderbyEmail =async(req,res)=>{
    const {email}=req.params;
    try{
        const order=await orderModel.find({email}).sort({createdAt:-1})
        if(!order){
            return res.status(400).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order find successful",data:order})
    }catch(err){
      res.status(400).json({message:"Order not found"});
    }
}


const getOrderbyID =async(req,res)=>{
    const {id}=req.params;
    try{
        const order=await orderModel.findById(id);
        if(!order){
            return res.status(400).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order find successful",data:order})
    }catch(err){
        res.status(400).json({message:"Order not found"});
    }
}


const getAllorder=async(req,res)=>{
    try {
        const order=await orderModel.find();
        if(!order){
            return res.status(400).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order find successful",data:order})
    }catch (e){
        res.status(400).json({message:"Order not found"});
    }
}


const UpdateorderStatus=async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body
    try {
        const order=await orderModel.findByIdAndUpdate(id,{status,updatedAt:new Date()})
        if(!order){
            return res.status(400).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order update successful",data:order})
    }catch(err){
        res.status(400).json({message:"Order not found"});
    }
}


const deleteOrderbyID=async(req,res)=>{
    const {id}=req.params;
    try {
        const order=await orderModel.findByIdAndDelete(id)
        if(!order){
            return res.status(400).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order delete successful",data:order})
    }catch(err){
        res.status(400).json({message:"Order not found"});
    }
}

module.exports={mekePaymentRequest,confirmPayment,getOrderbyEmail,getOrderbyID,getAllorder,UpdateorderStatus,deleteOrderbyID}