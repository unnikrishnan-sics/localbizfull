const JoinedEvent = require("../Models/JointEvent");
const Event = require("../Models/eventModel"); // To check if event exists
const Bussiness = require("../Models/bussinessModel"); // Assuming you have a Bussiness model

const joinEvent = async (req, res) => {
    try {
        const { businessId, eventId } = req.body;

        if (!businessId || !eventId) {
            return res.status(400).json({ message: "Business ID and Event ID are required." });
        }

        // Validate if business and event exist
        const existingBusiness = await Bussiness.findById(businessId);
        if (!existingBusiness) {
            return res.status(404).json({ message: "Business not found." });
        }

        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return res.status(404).json({ message: "Event or Training not found." });
        }

        // Check if the business has already joined this event/training
        const alreadyJoined = await JoinedEvent.findOne({ business: businessId, event: eventId });
        if (alreadyJoined) {
            return res.status(409).json({ message: "You have already joined this event/training." });
        }

        const newJoinedEvent = new JoinedEvent({
            business: businessId,
            event: eventId
        });

        await newJoinedEvent.save();

        res.status(201).json({
            message: "Successfully joined the event/training.",
            data: newJoinedEvent
        });

    } catch (error) {
        console.error("Error joining event:", error.message);
        // Handle unique constraint error specifically (e.g., if multiple requests hit simultaneously)
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ message: "You have already joined this event/training." });
        }
        res.status(500).json({ message: "Failed to join event/training.", error: error.message });
    }
};

const getJoinedEventsByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;

        if (!businessId) {
            return res.status(400).json({ message: "Business ID is required." });
        }

        // Populate the 'event' field to get event details
        const joinedEvents = await JoinedEvent.find({ business: businessId }).populate('event');

        res.status(200).json({
            message: "Joined events fetched successfully.",
            data: joinedEvents
        });

    } catch (error) {
        console.error("Error fetching joined events:", error.message);
        res.status(500).json({ message: "Failed to fetch joined events.", error: error.message });
    }
};
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({
            message: "All events fetched successfully.",
            data: events
        });
    } catch (error) {
        console.error("Error fetching all events:", error.message);
        res.status(500).json({ message: "Failed to fetch all events.", error: error.message });
    }
};

const getEventsByCommunity = async (req, res) => {
    try {
        const { communityId } = req.params; // Assuming communityId comes from URL params

        if (!communityId) {
            return res.status(400).json({ message: "Community ID is required." });
        }

        // Assuming your Event model has a 'community' field that stores the community's ID/name
        const events = await Event.find({ community: communityId });

        if (events.length === 0) {
            return res.status(404).json({ message: `No events found for community: ${communityId}.` });
        }

        res.status(200).json({
            message: `Events for community '${communityId}' fetched successfully.`,
            data: events
        });

    } catch (error) {
        console.error("Error fetching community events:", error.message);
        res.status(500).json({ message: "Failed to fetch community events.", error: error.message });
    }
};
const getAllJointEvents = async (req, res) => {
    try {
        const events = await JoinedEvent.find({})
            .populate('business')  // Populate the business field
            .populate('event');    // Populate the event field
            
        res.status(200).json({
            message: "All events fetched successfully.",
            data: events
        });
    } catch (error) {
        console.error("Error fetching all events:", error.message);
        res.status(500).json({ message: "Failed to fetch all events.", error: error.message });
    }
};
module.exports = {
    joinEvent,
    getJoinedEventsByBusiness,
     getAllEvents,
    getEventsByCommunity,
    getAllJointEvents
};