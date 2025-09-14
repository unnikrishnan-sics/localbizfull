const Review = require("../Models/reviewModel");
const Customer = require("../Models/customerModel");
const Business = require("../Models/bussinessModel");

const createReview = async (req, res) => {
    try {
        const { consumer, business, rating, comment } = req.body;

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        // Check if consumer and business exist
        const existingConsumer = await Customer.findById(consumer);
        if (!existingConsumer) {
            return res.status(404).json({ message: "Consumer not found." });
        }

        const existingBusiness = await Business.findById(business);
        if (!existingBusiness) {
            return res.status(404).json({ message: "Business not found." });
        }

        const newReview = new Review({
            consumer,
            business,
            rating,
            comment
        });

        await newReview.save();

        res.status(201).json({
            message: "Review created successfully",
            data: newReview
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Validate rating if provided
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found." });
        }

        res.status(200).json({
            message: "Review updated successfully.",
            review: updatedReview
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const getReviewsByBusinessId = async (req, res) => {
    try {
        const { businessId } = req.params;

        const reviews = await Review.find({ business: businessId })
            .populate('consumer', 'name profilePic') // Populate consumer details, only name and profilePic
            .sort({ createdAt: -1 }); // Sort by newest first

        if (!reviews || reviews.length === 0) {
            return res.status(200).json({ message: "No reviews found for this business.", data: [] });
        }

        res.status(200).json({
            message: "Reviews fetched successfully.",
            data: reviews
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    updateReview,
    getReviewsByBusinessId
};
