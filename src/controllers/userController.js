import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// -------------------------
// 📧 Email Sender Utility
// -------------------------
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // or use SendGrid / Resend in production
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Heritage App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

// -------------------------
// 📧 Register User
// -------------------------
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check duplicate
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashed = await bcrypt.hash(password, 12);

        // Create user with verification token...
        const user = new User({ name, email, password });
        const verifyToken = user.generateVerificationToken();
        await user.save();

        // Send verification email....
        const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;
        await sendEmail(
            email,
            "Verify your email",
            `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- Email container -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            
            <!-- Header with Logo -->
            <tr>
              <td align="center" style="background-color: #4CAF50; padding: 20px;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" alt="Logo" width="60" height="60" style="display: block;" />
                <h1 style="color: #ffffff; margin: 10px 0 0; font-size: 24px;">Welcome to Our Platform</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333333;">Hi <strong>${name}</strong>,</p>
                <p style="font-size: 16px; color: #333333;">
                  Thank you for signing up. Please verify your email address by clicking the button below:
                </p>

                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                  <tr>
                    <td align="center">
                      <a href="${verifyUrl}" target="_blank" style="
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 14px 24px;
                        font-size: 16px;
                        border-radius: 6px;
                        display: inline-block;
                        font-weight: bold;
                      ">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; color: #777777;">
                  If the button doesn’t work, you can also click the link below or paste it into your browser:
                </p>
                <p style="font-size: 14px; color: #0066cc; word-break: break-all;">
                  <a href="${verifyUrl}" target="_blank" style="color: #0066cc;">${verifyUrl}</a>
                </p>

                <p style="font-size: 14px; color: #999999;">If you did not sign up for this account, you can ignore this email.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f4f4f4; text-align: center; padding: 20px; font-size: 12px; color: #aaaaaa;">
                &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
        );


        res.json({ message: "Registration successful. Please check your email to verify your account." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};

// -------------------------
// 📧 Verify Email.....
// -------------------------
export const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ error: "Invalid or expired token" });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({ message: "Email verified successfully. You can now log in." });
    } catch (err) {
        res.status(500).json({ error: "Verification failed" });
    }
};

// -------------------------
// 🔑 Login....
// -------------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.isVerified) {
            return res.status(401).json({ error: "Please verify your email first" });
        }

        const match = await user.matchPassword(password); // uses bcrypt.compare internally
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                points: user.points,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
};

// -------------------------
// 🎯 Add Points (Admin only)....
// -------------------------
export const addPoints = async (req, res) => {
    try {
        const { points } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.points += points;
        await user.save();

        res.json({ message: "Points added", points: user.points });
    } catch (err) {
        res.status(500).json({ error: "Failed to add points" });
    }
};

// -------------------------
// 🏆 Leaderboard.....
// -------------------------
export const leaderboard = async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ points: -1 })
            .limit(10)
            .select("name email points");
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};

// -------------------------
// 🔒 Forgot Password
// -------------------------
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const resetToken = user.generatePasswordResetToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail(
            user.email,
            "Password Reset",
            `<p>Click below to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
        );

        res.json({ message: "Password reset email sent" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send reset email" });
    }
};

// -------------------------
// 🔑 Reset Password
// -------------------------
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
