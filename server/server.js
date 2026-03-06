const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db');

dotenv.config();
connectDB();
const PORT=process.env.PORT || 5000;
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.json({message:'Secure Vault API working'});
});

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});


