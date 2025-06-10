const express = require('express')
const {createNewProduct, getSingleProduct, deleteSingleProduct, updateSingleProduct, getProductsQuery, getAllProducts,
    getProductsByCategory
} = require("./product.controller");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router()

router.post("/creat-product",createNewProduct)
router.get('/All-product',getAllProducts)
router.get('/product-category/:category',getProductsByCategory)
router.get("/getAll-Product",getProductsQuery)
router.get("/getsingle-product/:id",getSingleProduct)
router.put("/update-product/:id",verifyToken,verifyAdmin,updateSingleProduct)
router.delete("/delete-product/:id",verifyToken,verifyAdmin,deleteSingleProduct)

module.exports = router