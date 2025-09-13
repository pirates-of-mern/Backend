import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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

        isAdmin: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["user", "admin", "owner"], // only owner can promote/demote admins
            default: "user",
        },
        permissions: {
            manage_users: { type: Boolean, default: false },
            manage_heritage: { type: Boolean, default: false },
            manage_content: { type: Boolean, default: false },
        },

        points: {
            type: Number,
            default: 0,
        },

        // Email Verification
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        verificationTokenExpires: Date,

        // password resest krne ke liye
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },

        date_joined: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);


// 🔒 Middleware: Hash password before saving

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


// 🔑 Method: Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// 📧 Method: Generate email verification token
userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.verificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hours ok with time
    return token;
};


// 🔑 Method: Generate password reset token

userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    return token;
};

export default mongoose.model("User", userSchema);
