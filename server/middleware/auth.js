const jwt=require('jsonwebtoken');

module.exports=function(req,res,next){
    const token=req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:'no token provided. access denied!'});
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded.user;
        next();
    } catch (error) {
        console.error('error: ',error.message);
        return res.status(500).json({msg:'server error :\\'});
    }
};