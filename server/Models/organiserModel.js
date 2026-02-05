const mongoose = require("mongoose");
const organiserSchema = mongoose.Schema(
    {
        organizationName: {
            type: String,
            required: true
        },
        organizationType: {
            type: String,
            required: true
        },
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        dateOfBirth: {
            type: Date,
        },
        phone: {
            type: Number,
            require: true
        },
        profilePic: {
            type: Object,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        agreed: {
            type: Boolean,
            require: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        isActive: {
            type: Boolean,
            default: true
        },
        isAdminApproved: {
            type: Boolean,
            default: false
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "bussiness"
        }]
    }, { timeStamps: true }
)

module.exports = mongoose.model("organisation", organiserSchema)
