const express=require('express');
const router=express.Router();

// import the controller 
const {imageUpload, videoUpload, imageSizeReducer, localFileUpload}=require('../controllers/fileUpload');

// api route 

router.post('/localFileUpload',localFileUpload);
router.post('/imageUpload',imageUpload);
router.post('/videoUplaod',videoUpload);
router.post('/imageSizeReducer',imageSizeReducer);

module.exports=router;

