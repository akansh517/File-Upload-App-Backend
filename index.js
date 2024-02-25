// app create 
const express=require('express');
const app=express();

// Port find out 
require('dotenv').config();
const PORT=process.env.PORT || 3000;

// add middleware
app.use(express.json());
// We know that express framework can only interact with json files only but if i want to interact with some other file then i can use some third party pkgs e.g :- multer,expressfileUpload through which i can interact with the files also 
// express-fileupload install- simple express middleware for uploading files

// use temp files instead of memory for managing the upload process pass the 2 parameters to upload the file on cloudinary if we don't pass these 2 parameters then tempfiles will be empty and will not receive the response

const fileupload=require('express-fileupload');
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

// connect app with db 
const db=require('./config/database');
db.connect();

// connect with cloud 
const cloudinary=require('./config/cloudinary');
cloudinary.cloudinaryConnect(); //for connection we use this method

// api route mount
const Upload=require('./routes/FileUpload'); 
app.use('/api/v1/upload',Upload);

// activate server 

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})








