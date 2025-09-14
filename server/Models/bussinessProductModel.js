const mongoose=require("mongoose");
const bussinessProductSchema=mongoose.Schema({
    productName:{
        type:String,
        required:true   
    },
    productDescription:{
        type:String,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stockavailable:{
        type:Number,
        required:true
    },
    discountPrice:{
        type:Number,
        required:true
    },
    specialOffer:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    photo:{
        type:Object,
        required:true
    },
    ads: [{  // New field for ads images
        type: Object,
        required: true
    }],
    bussinessId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bussiness",
        required:true
    }

},{timeStamps:true});

module.exports=mongoose.model("bussinessProducts",bussinessProductSchema);