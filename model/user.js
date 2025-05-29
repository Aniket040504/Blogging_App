const {createHmac, randomBytes}=require('crypto')
const {Schema, default: mongoose} = require('mongoose');

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{ // for hashing password
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:"/images/default.png",
    },
    role:{
        type:String,
        enum: ["USER","ADMIN"],
        default:"USER",
    },
},
    {
        timestamps:true,
    }
)

userSchema.pre('save', function(next) {
    const user=this; //current user

    if(!user.isModified("password")) return next();

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest('hex');

    this.salt=salt
    this.password=hashedPassword

    next();
})

userSchema.static('matchPassword', async function(email,password){

    const user=await this.findOne({email});
    if(!user) throw new Error('User not found');

    const salt=user.salt;
    const hashedPassword= user.password;

     const userProvidedHash=createHmac('sha256',salt).update(password).digest('hex');

     if(hashedPassword!=userProvidedHash) throw new Error('Incorrect Password');
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.salt;

    return userObj;
})

const User=mongoose.model("user",userSchema);

module.exports=User;