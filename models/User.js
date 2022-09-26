const mongoose = require("mongoose");
const {isEmail}= require("validator");
const bcrypt = require("bcrypt");


const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter a email iD'],
        unique:true,
        lowercase:true,
        validate:[isEmail, ' Enter a valid emailiD']
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength : [6,'password should be of min 6length characters']

    }
})

userSchema.pre('save',async function(next){
    const salt= await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

//static method to login
userSchema.statics.login=async function(email,password){
    //console.log("entered")
    const user= await this.findOne({email})
    if(user)
    {
        //console.log("entered1")
       const auth= await bcrypt.compare(password,user.password);
       if(auth)
        {
            //console.log("entered2")
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User= mongoose.model("User",userSchema);


module.exports=User;