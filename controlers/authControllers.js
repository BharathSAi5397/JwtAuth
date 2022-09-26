const User = require("../models/User");
const jwt=require("jsonwebtoken");


//handling errors
const handleError = (err) => {
    console.log(err.message);
    let errors = { email: '', password: '' };

    //incorect email
    if(err.message=='incorrect email')
    {
        //console.log("ping")
        errors.email='incorrect email';
        return errors;  
    }
    if(err.message=='incorrect password')
    {
        //console.log("ping1")
        errors.password='incorrect password';
        return errors;
    }
    //duplicate error
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }
    //user validation error
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}


//createToken
const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({ id }, "mykey", {expiresIn:maxAge });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');

}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create({ email, password });
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge*1000})
        res.status(201).json({user:user._id})
    } catch (e) {
        const errors = handleError(e);
        //console.log(errors)
        res.status(400).json({errors})
    }
}

module.exports.login_post =async (req, res) => {
    const { email, password } = req.body;
    try{
        const user=await User.login(email,password);
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge*1000})
        res.status(200).json({user:user._id})
    }catch(e){
        const errors = handleError(e);
        res.status(400).json({errors})
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt','',{maxAge:1});
    res.redirect("/")

}