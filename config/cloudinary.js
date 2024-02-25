const cloudinary=require('cloudinary').v2;

require('dotenv').config();
exports.cloudinaryConnect=()=>{
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET
        })
    }
    catch(error){
        console.log(error);
    }
}

// Inside the config method we have to define 3 things to establish the connection -cloud name ,api key,api secret .this method basically connects the app with the cloudinary