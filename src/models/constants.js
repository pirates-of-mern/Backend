import mongoose from "mongoose";

const heritageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { city: String, state: String, country: String },
    build_year: Number,
    category: { type: String, enum: ['Heritage', 'Monument', 'Temple', 'Cave', 'Fort', 'Palace', 'Museum', 'Other'], required: true },
    description: String,
    images: [String],
    videos: [String],
    added_by: { type: String, default: "admin" },
    date_added: { type: Date, default: Date.now }
});

export default mongoose.model("Heritage", heritageSchema);


