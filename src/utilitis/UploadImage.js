const cloudinary=require('cloudinary').v2;

cloudinary.config({
    cloud_name:'dgsmvky0e',
    api_key:'847293588486513',
    api_secret:'VpnPulIE5CsS3JCpk9YRfz_KJ2U',
})


const option={
    overwrite:true,
    invalidate:true,
    resource_type:'auto'
}

module.exports=(image)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(image,option,(err,result)=>{
            if(result && result.secure_url){
                return resolve(result.secure_url)
            }
            console.log(err.message)
            return reject({message:err.message})
        })
    })
}