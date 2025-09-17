import mongoose from "mongoose";
import {
    hashPasswordMiddleware,
    matchPassword,
    generateVerificationToken,
    generatePasswordResetToken
} from "./user.methods.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        isAdmin: { type: Boolean, default: false },

        role: {
            type: String,
            enum: ["user", "admin", "owner"],
            default: "user",
        },

        permissions: {
            type: [String], // flexible array
            default: [],
        },

        points: { type: Number, default: 0 },

        // Email verification
        isVerified: { type: Boolean, default: false },
        verificationToken: String,
        verificationTokenExpires: Date,

        // Password reset
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        // Security (brute-force protection)
        loginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date },

        date_joined: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// 🔒 Middleware
userSchema.pre("save", hashPasswordMiddleware);

// 🔑 Methods
userSchema.methods.matchPassword = matchPassword;
userSchema.methods.generateVerificationToken = generateVerificationToken;
userSchema.methods.generatePasswordResetToken = generatePasswordResetToken;

userSchema.methods.isAccountLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

export default mongoose.model("User", userSchema);
