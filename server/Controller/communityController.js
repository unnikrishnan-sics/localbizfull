const Organiser = require("../Models/organiserModel");
const Bussiness = require("../Models/bussinessModel");
const sendEmail = require("../Utils/emailService");

const viewBusinessRequests = async (req, res) => {
    try {
        // This route is ambiguous given the current model structure.
        // Assuming it's for a community admin to view businesses that are not yet members.
        // A more robust solution would involve a dedicated "CommunityJoinRequest" model.
        // For now, we'll return businesses that are not yet part of this community's members list.

        const communityId = req.user.id; // Extract community ID from authenticated user's token
        const community = await Organiser.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: "Community not found." }); // Should not happen if token is valid
        }

        // Find businesses that are not in this community's members list
        const nonMemberBusinesses = await Bussiness.find({
            _id: { $nin: community.members }
        });

        res.status(200).json({
            message: "Businesses not yet members of this community fetched successfully",
            data: nonMemberBusinesses
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const approveRejectBusiness = async (req, res) => {
    try {
        const { id } = req.params; // This 'id' is the community ID
        const { businessId, status } = req.body; // businessId to approve/reject, and status ("approved" or "rejected")

        const community = await Organiser.findById(id);
        if (!community) {
            return res.status(404).json({ message: "Community not found." });
        }

        const business = await Bussiness.findById(businessId);
        if (!business) {
            return res.status(404).json({ message: "Business not found." });
        }

        if (status === "approved") {
            if (!community.members.includes(businessId)) {
                community.members.push(businessId);
                await community.save();
                // Send notification to business
                await sendNotificationToBusiness(business.email, "Community Membership Approved", `Congratulations! Your request to join ${community.organizationName} has been approved.`);
                res.status(200).json({ message: "Business approved and added to community members." });
            } else {
                res.status(400).json({ message: "Business is already a member of this community." });
            }
        } else if (status === "rejected") {
            // Optionally remove if they were somehow added or just acknowledge rejection
            community.members = community.members.filter(memberId => memberId.toString() !== businessId);
            await community.save();
            // Send notification to business
            await sendNotificationToBusiness(business.email, "Community Membership Rejected", `Your request to join ${community.organizationName} has been rejected.`);
            res.status(200).json({ message: "Business rejected from community." });
        } else {
            res.status(400).json({ message: "Invalid status provided. Must be 'approved' or 'rejected'." });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const sendNotificationToBusiness = async (email, subject, message) => {
    try {
        await sendEmail({
            email,
            subject,
            message,
        });
        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error(`Error sending notification to ${email}:`, error.message);
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Organiser.find({}, '_id organizationName organizationType');
        res.status(200).json({
            message: "Communities fetched successfully",
            data: communities
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    viewBusinessRequests,
    approveRejectBusiness,
    sendNotificationToBusiness,
    getAllCommunities // Export the new function
};
