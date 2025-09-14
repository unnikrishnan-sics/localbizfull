
const customerModel=require("../Models/customerModel");
const bcrypt=require("bcryptjs");
const multer=require("multer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../Utils/emailService");
const businessProductModel = require('../Models/bussinessProductModel') // ADD THIS LINE

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads")
    },
    filename:(req,file,cb)=>{
        const prefix="profile-";
        const fullName=file.originalname;
        const extension=file.originalname.split(".").pop();
        const fileName=prefix + fullName.substring(0,fullName.lastIndexOf("."))+Date.now()+ "."+extension;
        cb(null,fileName);
    }
})
const uploadProfilePic=multer(
    {storage:storage}
    ).single("profilePic")

const customerRegister= async (req,res)=>{
    try {
        const { name, email, password,confirmpassword, address, phone ,agreed} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePic=req.file;
        const newCustomer= await new customerModel({
            name,
            email,
            password:hashedPassword,
            confirmpassword:hashedPassword,
            address,
            phone,
            agreed,
            profilePic
        });

        let existingCustomer=await customerModel.findOne({email});
        if(existingCustomer){
             return res.json({
                message:"Customer already registered with this email"
            })
        };
        existingCustomer=await customerModel.findOne({phone});
        if(existingCustomer){
             return res.json({
                message:"Customer already registered with this phone number"
            })
        }
        if(password!==confirmpassword){
            return res.json({message:"Password and Confirm Password should be same."})
        }

       await newCustomer.save()  ;
       res.status(201).json({
        message:"Customer created successfully",
        data:newCustomer
       })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
};

const customerLogin=async (req,res)=>{
    try {
        const {email,password}=req.body;
        const customer=await customerModel.findOne({email});
        if(!customer){
            return res.json({message:"customer not found with this email."})
        }
        const isMatch=await bcrypt.compare(password,customer.password);
        if(!isMatch){
            return res.json({message:"Invalid Password."})
        }
        const token=await jwt.sign({id:customer._id},process.env.SECRET_KEY,{expiresIn:"1hr"});
        res.status(200).json({message:"customer logged in successfully",token:token});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}

const customerForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await customerModel.findOne({ email });

        if (!customer) {
            return res.status(404).json({ 
                success: false,
                message: "No customer found with this email." 
            });
        }

        res.status(200).json({ 
            success: true,
            message: "Email verified. You can reset your password now." 
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const customerResetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await customerModel.findOne({ email });

        if (!customer) {
            return res.status(404).json({ 
                success: false,
                message: "No customer found with this email." 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        customer.password = hashedPassword;
        customer.confirmpassword = hashedPassword;

        await customer.save();
        res.status(200).json({ 
            success: true,
            message: "Password reset successfully." 
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
const getCustomerById=async(req,res)=>{
    try {
        const customerId=req.params.id;
        const customer=await customerModel.findById(customerId);
        if(!customer){
            return res.json({message:"No customer found with this id."})
        }
        return res.json({
            message:"customer found with the provided id",
            customer:customer
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}
const editCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const profilePic = req.file;
        const { name, email, phone, address } = req.body;

        const updatedCustomer = await customerModel.findByIdAndUpdate(
            customerId,
            { name, email, phone, address,profilePic },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        res.json({ message: "Customer updated successfully.", customer: updatedCustomer });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await businessProductModel.find();
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};
module.exports={customerRegister,uploadProfilePic,customerLogin,customerForgotPassword,customerResetPassword,getCustomerById,editCustomerById,getAllProducts};