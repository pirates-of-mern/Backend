import mongoose from "mongoose";

function arrayLimit(val) {
    return val.length <= 10;
}

const heritageSchema = new mongoose.Schema({
    name: { type: String, required: true },

    location: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        latitude: Number,
        longitude: Number,
    },

    build_year: Number,
    build_by: String,

    category: {
        type: String,
        enum: [
            "Heritage",
            "Monument",
            "Temple",
            "Cave",
            "Fort",
            "Religious",
            "Palace",
            "Museum",
            "Other",
        ],
        required: true,
    },

    heritage_type: {
        type: String,
        enum: ["Cultural", "Natural", "Mixed"],
    },

    unesco_status: { type: Boolean, default: false },

    description: String,

    images: {
        type: [String],
        validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },

    videos: {
        type: [String],
        validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },

    tags: {
        type: [String],
        validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },

    extra_info: {
        visitors_per_year: { type: Number, default: 0 },
        entry_fee: {
            indian: { type: Number, default: 0 },
            foreigner: { type: Number, default: 0 },
        },
        timings: String,
        closed_on: String,
    },

    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    date_added: { type: Date, default: Date.now },
    last_updated: { type: Date, default: Date.now },
});

// auto update last_updated
heritageSchema.pre("save", function (next) {
    this.last_updated = Date.now();
    next();
});

export default mongoose.model("HeritageSite", heritageSchema,"heritagesites");
