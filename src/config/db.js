import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://learnonix:0zJqgmtVKkGrYTBV@bot.xujbjsz.mongodb.net/heritageDB";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
};

export default connectDB;
