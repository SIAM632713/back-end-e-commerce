const Products=require("../products/product.model")
const Reviews=require("../reviews/review.model")


const createNewProduct=async(req,res)=>{
    try{
        const newProduct=new Products({
            ...req.body
        })
        const saveProduct=await newProduct.save();

        const reviews=await Reviews.find({productID:saveProduct._id})
        if(reviews.length>0){
            const totalRating=reviews.reduce((acc,review)=>acc+review.rating,0)
            const avarageRating=totalRating/reviews.length;
            saveProduct.rating=avarageRating;
            await saveProduct.save();
        }
        return res.status(201).json({message:"Product created successfully."});
    }catch(err){
     console.error(err)
       return  res.status(400).json({message:"Product created failed"});
    }
}



const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find().populate("author", "email username").sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All products fetched successfully.",
            data: products
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Failed to fetch products." });
    }
};

const getProductsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const products = await Products.find({ category }).populate("author", "email username");

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found in this category." });
        }

        return res.status(200).json({
            message: "Products fetched successfully by category.",
            data: products,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error while fetching products." });
    }
};


const getProductsQuery=async(req,res)=>{
    try{
        const {category,color,minPrice,maxPrice,page=1,limit=10}=req.query;
        const filter={};
        if(category && category !== "all"){
            filter.category=category;
        }
        if(color && color!=="all"){
            filter.color=color;
        }
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (!isNaN(min) && !isNaN(max)) {
            filter.price = { $gte: min, $lte: max };
        } else if (!isNaN(min)) {
            filter.price = { $gte: min };
        } else if (!isNaN(max)) {
            filter.price = { $lte: max };
        }

        const skip=(parseInt(page)-1)*parseInt(limit);
        const totalProduct=await Products.countDocuments(filter);
        const totalPages=Math.ceil(totalProduct/parseInt(limit))
        const products=await Products.find(filter)
        .skip(skip)
            .limit(parseInt(limit))
            .populate("author",'email username')
        .sort({createAt:-1});

        return res.status(200).json({message:"Product found successfully.",data:products,totalPages,totalPages});
    }catch(err){

    }
}

const getSingleProduct=async (req,res)=>{
    const {id}=req.params;
    try{
        const Singleproduct=await Products.findById(id).populate("author",'email username')
        if(!Singleproduct){
            return res.status(404).json({message:"Product not found"});
        }

        const singleReview=await Reviews.find({productID:id}).populate("userID",'username')
        if(!singleReview){
            res.status(404).json({message:"Review not found"});
        }

        res.status(200).json({message:"Product found successfully.",data:{Singleproduct,singleReview}});
    }catch (e){
     console.error(e)
        return res.status(400).json({message:"Product not found"});
    }
}


const updateSingleProduct=async(req,res)=>{
    const {id}=req.params;
    const { name, category, description, price, oldPrice, image, color, rating } = req.body;
    try{
        const updateProduct=await Products.findByIdAndUpdate(id,{
            name:name,
            price:price,
            oldPrice:oldPrice,
            image:image,
            color:color,
            rating:rating,
            category:category,
            description:description
        },{new:true});
        if(!updateProduct){
            res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({message:"Product update successfully."});
    }catch(err){
        console.error(err)
        res.status(400).json({message:"Product not found"});
    }
}


const deleteSingleProduct=async(req,res)=>{
    const {id}=req.params;
    try{
        const result=await Products.findByIdAndDelete(id);
        if(!result){
           return  res.status(404).json({message:"Product not found"});
        }

        await Reviews.deleteMany({productID:id})
        res.status(200).json({message:"Product delete successfully."});
    }catch(err){
         console.error(err)
        res.status(400).json({message:"Product not found"});
    }
}

module.exports={createNewProduct,getProductsQuery,getSingleProduct,updateSingleProduct,deleteSingleProduct,getAllProducts,getProductsByCategory}