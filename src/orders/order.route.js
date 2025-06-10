const express = require("express");
const {mekePaymentRequest, confirmPayment, getOrderbyEmail, getOrderbyID, getAllorder, UpdateorderStatus,
    deleteOrderbyID
} = require("./order.controller");
const router = express.Router();

router.post('/create-checkout-session',mekePaymentRequest)
router.post('/confirm-payment',confirmPayment)
router.get('/get-orderbyemail/:email',getOrderbyEmail)
router.get('/get-orderbyid/:id',getOrderbyID)
router.get('/get-allorder',getAllorder)
router.post('/updateorder/:id',UpdateorderStatus)
router.post('/deleteorder/:id',deleteOrderbyID)

module.exports = router;