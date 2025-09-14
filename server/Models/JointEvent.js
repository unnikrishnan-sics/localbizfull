const mongoose = require("mongoose");

const joinedEventSchema = mongoose.Schema(
    {
        business: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "bussiness", // Assuming your business model's Mongoose name is 'bussiness'
            required: true
        }],
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event", // Referencing the existing Event model
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // This will add createdAt and updatedAt fields
    }
);

// Add a unique compound index to prevent a business from joining the same event multiple times
joinedEventSchema.index({ business: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("JoinedEvent", joinedEventSchema);