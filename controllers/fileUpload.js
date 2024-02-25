const File=require('../models/File');

const cloudinary=require('cloudinary').v2;

// localfileUpload -> Handler fxn  
// it basically takes the data from clients pc like it can be Image,video and stores in an servers path 

exports.localFileUpload=async(req,res)=>{
    try{
        // if i want to fetch the file from the request then i have to use the hierarchy req.files.file;
        //fetch file from request
        const file=req.files.file;
        console.log("File",file);

        // 2nd thing on which serevr path i want to store the file 
        // __dirname means it defines the current working directory on which i am doing work and after that go to the controllers inside which i have one folder named files and inside the file folder use Date.now() as name and after that extension that is unique path
        // i have split the file by using . and fetch the 1st index of the file in which my file extension is stored
        // 2.create path where file need to be stored on server
                //current directory which is controllers and Date.now() is the name of the file in milliseconds
        let path=__dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`  ;  //server path bcz i want to store in the server
        console.log("PAth->",path);                     // akansh.jpg split on the basis of . and fetches the fisrt index in which ext.

        // If i want to upload the file then inside the file move fxn is very important it moves the file to servers particular location
        // 3.add path to the move fxn 
        file.mv(path,(err)=>{
            console.log(err);
        });  
        // and after that add it to response and sent the response
        // 4.create successful response 
        res.json({
            success:true,
            message:"Local File uploaded successfully"
        });
    }
    catch(error){
        console.log("Not able to upload the file ")
        console.log(error);
    }
}






// Define the imageUpload handler 

function isFileTypeSupported(type,supportedTypes){ //fxn which checks whether the file type is supported or not
    return supportedTypes.includes(type);
}

// file upload fxn which is async because we are uploading the file so i am passing the file and folder in which i want to save the file

async function uploadFileToCloudinary(file,folder,quality){
    const options={folder}; //it is the folder in which we want to push the data
    
    if(quality){
        options.quality=quality;
    }

    options.resource_type="auto"; //this means detect automatically the type of file
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}                                          //files temporary path the folder which built on the server

exports.imageUpload=async(req,res)=>{
    try{
        // data fetch from the request 
        const {name,tags,email}=req.body;
        console.log(name,tags,email);

        // receive file 
        // files ke baad imageFile name ki file hai vo receive krni hai uski key ko darshata hai

        const file=req.files.imageFile;
        console.log(file);

        // Validation 
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log("File Type:",fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported"
            })
        }

        // File format supported 
        // now i have to upload on the cloudinary by using the cloudinary upload fxn 
        
        const response=await uploadFileToCloudinary(file,"CloudDB");
        console.log(response);
        // Save the entry in DB 

        const fileData=await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url
        })  

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image Successfully uploaded"
        })

    }

    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Something went wrong"
        });
    }
}









//Video upload handler 

exports.videoUpload=async(req,res)=>{
    try{
        // data fetch 
        const {name,tags,email}=req.body;
        console.log(name,tags,email);

        const file=req.files.videoFile;
        console.log(file);

        // Validation

        const supportedTypes=["mp4","mov"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log("File Type: ",fileType);

        // TODO :Add a upper limit of 5 MB for video 
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not supported"
            })
        }


        // if file format supported then upload it on the cloudinary 

        console.log("Uploading to CLOuD DB");
        const response=await uploadFileToCloudinary(file,"CloudDB");
        console.log(response);

        // Insert the entry into db of video file 

        const fileData=await File.create({
            name,
            tags,
            email,
            videoUrl:response.secure_url
        })

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:"Video uploaded successfully"
        })

    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"Something went wrong"
        })
    }
}








// the image which we are uploading is compressed before uploading 
exports.imageSizeReducer=async(req,res)=>{
    try{
        // data fetch 
        const {name,tags,email}=req.body;

        const file=req.files.imageFile;
        console.log(file);

        // validation 
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log("File type: ",fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File format not supported"
            })
        }
        // TODO : add a upper limit of 5 mb for image 
        // File format supported 
        console.log("Uploading to Cloud Db")
        const response=await uploadFileToCloudinary(file,"CloudDB", 30);
        console.log(response);

        // inserting into the db 
        const fileData=await File.create({
            name,
            email,
            tags,
            imageUrl:response.secure_url
        })

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"Image uploaded successfully"
        })

    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"Something went wrong"
        })
    }
}