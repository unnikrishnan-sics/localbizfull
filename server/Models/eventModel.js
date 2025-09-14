const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
    {
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "organisation",
            required: true
        },
        type: {
            type: String,
            enum: ["event", "training", "workshop"],
            required: true
        },
        organizer: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        description: {
            type: String
        },
        name:{
            type:String,
            required:true
        },
        venue:{
            type:String,
            required:true
        }
    },
    { timeStamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
