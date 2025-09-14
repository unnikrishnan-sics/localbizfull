const Event = require("../Models/eventModel");
const Organiser = require("../Models/organiserModel");

const createEvent = async (req, res) => {
    try {
        const { community, type, organizer,venue, date, description,name } = req.body;

        // Check if community exists
        const existingCommunity = await Organiser.findById(community);
        if (!existingCommunity) {
            return res.status(404).json({ message: "Community not found." });
        }

        const newEvent = new Event({
            community,
            type,
            organizer,
            date,
            description,venue,
            name
        });

        await newEvent.save();

        res.status(201).json({
            message: "Event created successfully",
            data: newEvent
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const editEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, organizer, date,venue, description } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { type, organizer, date, description ,venue},
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.status(200).json({
            message: "Event updated successfully.",
            event: updatedEvent
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const getEventsByBusinessId = async (req, res) => {
    try {
        const { id } = req.params; // This 'id' is the business ID

        // Find events where the organizer matches the business ID
        // Or, if events are linked via communities, you'd need to find communities the business belongs to,
        // then find events associated with those communities.
        // For now, assuming 'organizer' in Event model can be a business ID.
        const events = await Event.find({ organizer: id });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for this business." });
        }

        res.status(200).json({
            message: "Events fetched successfully",
            events: events
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.status(200).json({
            message: "Event fetched successfully",
            data: event
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('community');
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found." });
        }

        res.status(200).json({
            message: "Events fetched successfully",
            data: events
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    editEvent,
    getEventsByBusinessId,
    getEventById,
    getAllEvents
};
