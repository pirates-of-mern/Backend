import User from "../../models/User.js";
import crypto from "crypto";
import { sendEmail } from "./emailController.js";

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const resetToken = user.generatePasswordResetToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail(user.email, "Password Reset", `<a href="${resetUrl}">${resetUrl}</a>`);

        res.json({ message: "Password reset email sent" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send reset email" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired token" });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: "Password reset failed" });
    }
};
