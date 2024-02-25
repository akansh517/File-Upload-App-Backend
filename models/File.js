const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
require('dotenv').config();
const fileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    tags:{
        type:String
    },
    email:{
        type:String
    }
})

// post middleware 
// jese hi entry create kr di hai toh hamara ek middleware invoke ho jaega agar entry create krne se just pehle koi kaam krna hai toh pre middleware use krna hai us case main

// when my file has been saved then i need nodemailing fxnality so i will use save method 
// doc vo document hai jo maine database main save kiya hai 

// jese hi meri image,video or koi bhi file create ho jae db main yaa cloudinary main toh us entry ke create hone ke just baad hi mail chale jaye so that's why we are using post middleware 

// schema ke upar post middleware apply krna 
fileSchema.post("save",async function(doc){
    try{
        console.log("DOC",doc); //the entry which is created in my database i am calling that doc

        // transporter 
        // TODO:Shift this configuration under /config folder 

        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })


        // send mail by using sendMail fxn 

        let info=await transporter.sendMail({
            from:`JainHelp`,
            to:doc.email, //in the doc there is a email named key which is inside the doc that i have send to the request
            subject:"New file uploaded on cloudinary",
            html:`<h2>Hello Jee</h2> <p>File uploaded View Here: <a href="${doc.imageUrl}">${doc.imageUrl}</a></p>`,
        })

        console.log("INFO",info);
    }
    catch(error){
        console.error(error);
    }
})


const File=mongoose.model("File",fileSchema);
module.exports=File;

// or 
// module.exports=mongoose.model("File",fileSchema);





