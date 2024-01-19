const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema({
    name : {
        type:String,
        required:[true, "Name is required"],
    },
    email : {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already registered"],
    },
    password:{
        type:String, 
        required:[true, "Password is required"],
    },
    confirmpassword:{
        type:String, 
        required:[true, "confirm Password is required"],
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

// Generating tokens
registerSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error);
    }
}

registerSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,10);
    }
    next();
})

// create collections
const Register = new mongoose.model("Register",registerSchema);

module.exports = Register;

