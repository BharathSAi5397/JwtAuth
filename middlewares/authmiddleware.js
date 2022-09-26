const jwt= require("jsonwebtoken");
const User = require("../models/User");

const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'mykey',(err,decoded)=>{
            if(err)
            {
                console.log(err.message)
                res.redirect('/login');
            }else{
                console.log(decoded);
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}


const checkUser= (req,res,next)=>{
    const token=req.cookies.jwt; 
    if(token)
    {
        jwt.verify(token,'mykey',async (err,decoded)=>{
            if(err)
            {
                console.log(err.message);
                res.locals.user=null;
                next();
            }else{
                console.log(decoded);
                let user= await User.findById(decoded.id);
                res.locals.user=user;
                next();
            }
        })
    } 
    else{
       // console.log("none")
        res.locals.user=null;
        next();
    }
}

module.exports={requireAuth,checkUser};