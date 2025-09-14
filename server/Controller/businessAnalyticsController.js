const mongoose = require("mongoose"); // Import mongoose
const Bussiness = require("../Models/bussinessModel");
const BussinessProduct = require("../Models/bussinessProductModel");
const Organiser = require("../Models/organiserModel");

const getBusinessAnalytics = async (req, res) => {
    try {
        const businessId = req.params; // Extract businessId from authenticated user's token

        if (!businessId) {
            // This case should ideally not be hit if protectedRoute is working correctly
            return res.status(401).json({ message: "Unauthorized: Business ID not found in token." });
        }

        // Aggregate for total revenue and product sales
        const analytics = await BussinessProduct.aggregate([
            {
                $match: { bussinessId: new mongoose.Types.ObjectId(businessId) }
            },
            {
                $group: {
                    _id: "$bussinessId",
                    totalRevenue: { $sum: { $multiply: ["$price", "$stockavailable"] } }, // Simple revenue calculation
                    productSales: {
                        $push: {
                            productId: "$_id",
                            productName: "$productName",
                            salesCount: "$stockavailable" // Placeholder for sales count, ideally from orders
                        }
                    }
                }
            }
        ]);

        // Placeholder for total views (requires a separate tracking mechanism, e.g., middleware)
        const totalViews = 0; // To Be Implemented

        res.status(200).json({
            message: "Business analytics fetched successfully",
            data: {
                totalRevenue: analytics[0]?.totalRevenue || 0,
                totalViews: totalViews,
                productSales: analytics[0]?.productSales || []
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const joinCommunity = async (req, res) => {
    try {
        const businessId = req.user.id; // Extract businessId from authenticated user's token
        const { communityId } = req.body;

        if (!businessId) {
            return res.status(401).json({ message: "Unauthorized: Business ID not found in token." });
        }

        const business = await Bussiness.findById(businessId);
        if (!business) {
            return res.status(404).json({ message: "Business not found." }); // Should not happen if token is valid
        }

        const community = await Organiser.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found." });
        }

        // Check if business is already a member
        if (community.members.includes(new mongoose.Types.ObjectId(businessId))) {
            return res.status(400).json({ message: "Business is already a member of this community." });
        }

            community.members.push(new mongoose.Types.ObjectId(businessId));
        await community.save();

        res.status(200).json({
            message: "Request to join community submitted successfully."
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBusinessAnalytics,
    joinCommunity
};
