const mongoose = require("mongoose");
const bussinessSchema = mongoose.Schema(
    {
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
        bussinessName: {
            type: String,
            require: true
        },
        bussinessCategory: {
            type: String,
            require: true
        },
        bussinessDescription: {
            type: String,
            require: true
        },
        bussinessLogo: {
            type: Object,
            require: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        }
    }, { timeStamps: true }
);

bussinessSchema.index({ location: '2dsphere' }, { background: false })

module.exports = mongoose.model("bussiness", bussinessSchema)
