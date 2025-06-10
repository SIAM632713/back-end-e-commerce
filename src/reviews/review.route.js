const express=require("express")
const {postAReview, getReviews, countReviews} = require("./review.controller");
const verifyToken = require("../middleware/verifyToken");
const router=express.Router()

router.post('/reviewpost',verifyToken,postAReview)
router.post('/countReviews',countReviews)
router.get('/getreviews/:userID',getReviews)

module.exports=router;