const bussinessModel = require("../Models/bussinessModel");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../Utils/emailService");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        const prefix = "profile-";
        const fullName = file.originalname;
        const extension = file.originalname.split(".").pop();
        const fileName = prefix + fullName.substring(0, fullName.lastIndexOf(".")) + Date.now() + "." + extension;
        cb(null, fileName);
    }
})
// const uploadProfilePic=multer(
//     {storage:storage}
//     ).single("profilePic")
const upload = multer({ storage: storage }).fields([
    { name: "profilePic", maxCount: 1 },
    { name: "bussinessLogo", maxCount: 1 }
]);


const bussinessRegister = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, address, phone, bussinessName, bussinessCategory, bussinessDescription, agreed } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // const profilePic=req.file;
        // const bussinessLogo=req.file;
        const profilePic = req.files?.profilePic?.[0] || null;
        const bussinessLogo = req.files?.bussinessLogo?.[0] || null;

        const newBussiness = await new bussinessModel({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            agreed,
            bussinessName,
            bussinessCategory,
            bussinessDescription,
            bussinessLogo,
            profilePic,
            location: {
                type: 'Point',
                coordinates: [76.9366, 8.5241] // Coordinates for Trivandrum (Longitude, Latitude)
            }
        });

        let existingBussiness = await bussinessModel.findOne({ email });
        if (existingBussiness) {
            return res.status(400).json({
                message: "Bussiness already registered with this email"
            })
        };
        existingBussiness = await bussinessModel.findOne({ phone });
        if (existingBussiness) {
            return res.status(400).json({
                message: "Bussiness already registered with this phone number"
            })
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Password and Confirm Password should be same." })
        }

        await newBussiness.save();
        res.status(201).json({
            message: "Bussiness created successfully",
            data: newBussiness
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const bussinessLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const bussiness = await bussinessModel.findOne({ email });
        if (!bussiness) {
            return res.status(404).json({ message: "bussiness not found with this email." })
        }
        const isMatch = await bcrypt.compare(password, bussiness.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password." })
        }
        const token = await jwt.sign({ id: bussiness._id }, process.env.SECRET_KEY, { expiresIn: "1hr" });
        res.status(200).json({ message: "bussiness logged in successfully", token: token });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const bussinessForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const bussiness = await bussinessModel.findOne({ email });

        if (!bussiness) {
            return res.status(404).json({
                success: false,
                message: "No business found with this email."
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

const bussinessResetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const bussiness = await bussinessModel.findOne({ email });

        if (!bussiness) {
            return res.status(404).json({
                success: false,
                message: "No business found with this email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        bussiness.password = hashedPassword;
        bussiness.confirmpassword = hashedPassword;

        await bussiness.save();
        res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
const getBussinessById = async (req, res) => {
    try {
        const bussinessId = req.params.id;
        const bussiness = await bussinessModel.findById(bussinessId);
        if (!bussiness) {
            return res.json({ message: "No bussiness found with this id." })
        }
        return res.json({
            message: "bussiness found with the provided id",
            bussiness: bussiness
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}
const editBussinessById = async (req, res) => {
    try {
        const bussinessId = req.params.id;
        const { name, email, phone, address } = req.body;
        // const profilePic=req.file;
        const profilePic = req.files?.profilePic?.[0]?.filename || null;


        const updatedBussiness = await bussinessModel.findByIdAndUpdate(
            bussinessId,
            { name, email, phone, address, ...(profilePic && { profilePic }) },
            { new: true }
        );

        if (!updatedBussiness) {
            return res.status(404).json({ message: "bussiness not found." });
        }

        res.json({ message: "bussiness updated successfully.", bussiness: updatedBussiness });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bussinessRegister, upload, bussinessLogin, bussinessForgotPassword, bussinessResetPassword, getBussinessById, editBussinessById };
