const express=require('express')
const multer=require('multer')
const path = require('path')
const fs=require('fs')
const app=express()

app.use(express.json())
const singlefileStorage=multer.diskStorage({
    destination:function(req,file,cb){
        const folderName='singleimages'
        const storelocation=path.join(__dirname,folderName)
        fs.mkdirSync(storelocation,{recursive:true})
        cb(null,storelocation)
    },filename:function(req,file,cb){
        const name=`${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`
        console.log(file.fieldname,file.originalname,path.extname(file.originalname))
        console.log(name)
        cb(null,name)
    }
})
const uploadSingle=multer({storage:singlefileStorage})
const generateFolderName=(id)=>{
    return `randomFolder_${Date.now()}_${id}`
}
const multipleFileStorage=multer.diskStorage({
    destination:async function(req,file,cb){
        if(!req.folder){
            const folderName=generateFolderName(req.params.id)
            const storeLocation=path.join(__dirname,folderName)
            req.folder=storeLocation
            console.log(req.folder);
            fs.mkdirSync(storeLocation,{recursive:true});
        }
        cb(null,req.folder)
    },filename:function(req,file,cb){
        const filename=`${Date.now()}_${req.params.id}_image_${path.extname(file.originalname)}`
        console.log(filename)
        cb(null,filename)
    },
})
const uploadMultiple=multer({storage:multipleFileStorage})

const multipleVideoStorage=multer.diskStorage({
    destination:function(req,file,cb){
        if(!req.folder){
            const folderName=`VideoFolder_${Date.now()}_${req.params.id}`
            const storeLocation=path.join(__dirname,folderName)
            req.folder=storeLocation
            console.log(req.folder);
            fs.mkdirSync(storeLocation,{recursive:true});
        }
        cb(null,req.folder)
    },filename:function(req,file,cb){
        const filename=`${Date.now()}_${req.params.id}_video_${path.extname(file.originalname)}`
        console.log(filename)
        cb(null,filename)
    }
})
const uploadMultipleVideos=multer({storage:multipleVideoStorage})

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.post('/singlefile',uploadSingle.single('file'),(req,res)=>{
    try{
        console.log(req.body)
        res.send({message:"Thanks file recieved",status:200})
    }catch(e){
        console.log(e)
        res.send({status:400,message:e.message})
    }
})
app.post('/multiplefile/:id',uploadMultiple.array('images'),(req,res)=>{
    try{    
        console.log(req.body)
        res.send({status:200,message:"Thanks for uploading images!"})
    }catch(e){
        console.log(e)
        res.send({status:400,message:e.message})
    }
})
app.post('/multiplevideos/:id',uploadMultipleVideos.array('videos'),(req,res)=>{
    try{    
        console.log(req.body)
        res.send({status:200,message:"Thanks for uploading videos!"})
    }catch(e){
        console.log(e)
        res.send({status:400,message:e.message})
    }
})

app.listen(3001,()=>console.log('Running on 3001...'))