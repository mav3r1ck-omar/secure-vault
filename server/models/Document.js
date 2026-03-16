const mongoose=require('mongoose');

const DocumentSchema=mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    filename:{
        type:String,
        required:true
    },
    encryptedFilename:{
        type:String,
        required:true
    },
    filepath:{
        type:String,
        required:true
    },
    filesize:{
        type:Number
    },
    filetype:{
        type:String
    },
    encryptionIV:{
        type:String,
        required:true
    },
},{
    timestamps:true
});
module.exports=mongoose.model('Document',DocumentSchema);