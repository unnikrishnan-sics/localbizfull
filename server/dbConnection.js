const mongoose = require("mongoose");
const bussinessModel = require("./Models/bussinessModel"); // Import the model

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/localbiz");
const db = mongoose.connection;

db.on("error", () => {
    console.log("mongodb error");
});
db.once("open", async () => {
    console.log("DB connected");
    try {
        await bussinessModel.ensureIndexes();
        console.log("2dsphere index ensured for bussinesses collection.");
    } catch (error) {
        console.error("Error ensuring 2dsphere index:", error);
    }
});

module.exports = db;
