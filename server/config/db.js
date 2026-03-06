const mongoose=require('mongoose');

const connectDB=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MONGO DB CONNECTED SUCCESSFULLY');
    } catch (error) {
        console.error('connection to db failed',error.message);
        process.exit(1);
    }
};

module.exports=connectDB;