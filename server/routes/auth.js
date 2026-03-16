const express =require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const speakeasy=require('speakeasy');
const qr=require('qrcode');

const User=require('../models/User');
const AuditLog=require('../models/AuditLog');
const auth=require('../middleware/auth');

const router=express.Router();

router.post('/register',async(req,res)=>{
    const {email,password}=req.body;

    try{
        if(!email || !password){
            return res.status(400).json({msg: 'Please enter email and password!'});
        }

        let user= await User.findOne({email});
        if(user){
            return res.status(400).json({msg: 'User already exists!'});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        
        user=new User({email,password: hashedPassword});
       
        await user.save();

        const payload={user:{id:user.id,role:user.role}};

        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'},
            (err,token)=>{
                if(err)throw err;
                return res.json({token,user:{id:user.id,email:user.email,role:user.role}});
            }
            );

        await AuditLog.create({
            action:'new user registered',
            ipAddress:req.ip,
            user:user.id
        });

    }catch(e){
        console.error('error during registration: ',e.message);
        return res.status(500).json({msg:'server error during registration'});
    }
});

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({msg:'Please enter email and password'});
        }

        let user=await  User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'Invalid Credentials!'});
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({msg:'Invalid Credentials!'});
        }

        payload={user:{id:user.id,role:user.role}};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'},
            (err,token)=>{
                if(err) throw err;
                return res.json({token,user:{id:user.id,role:user.role,email:user.email},twoFArequired:user.twoFA});
            });

        await AuditLog.create({
            user:user.id,
            action:'LOGGED_IN',
            ipAddress:req.ip
        });
    }
    catch(e){
        console.error('error during login: ',e.message);
        return res.status(500).json({msg:'server error during login'});
    }
});

router.get('/me',auth,async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('error fetching user info: ',error.message);
        res.status(500).json({msg:'server error'});
    }
});

module.exports=router;
