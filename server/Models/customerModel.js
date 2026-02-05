const mongoose=require("mongoose");
const CustomerSchema=mongoose.Schema(
    {
        name:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true,
            unique:true
        },
        password:{
            type:String,
            require:true
        },
        dateOfBirth:{
            type:Date,
        },
        phone:{
            type:Number,
            require:true
        },
        profilePic:{
            type:Object,
            require:true
        },
        address:{
            type:String,
            require:true
        },
        agreed:{
            type:Boolean,
            require:true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        isActive:{
            type:Boolean,
            default:true
        },
        isAdminApproved:{
            type:Boolean,
            default:false
        }
    },{timeStamps:true}
)

module.exports=mongoose.model("customer",CustomerSchema)
