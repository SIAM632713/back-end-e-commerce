const express=require('express')
const multer=require('multer')
const fs = require('fs')
const cloudinary =require("../utilitis/cloudinary")

const router=express.Router()


const storage = multer.diskStorage({});
const upload = multer({ storage });


router.post('/', upload.single("image"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            overwrite: true,
            invalidate: true,
            resource_type: "auto"
        });

        fs.unlinkSync(req.file.path); // cleanup temp file

        res.status(200).json({ url: result.secure_url });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Image upload failed", error: err });
    }
})

module.exports = router;