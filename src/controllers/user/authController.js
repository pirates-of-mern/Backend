import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// -------------------------
// Register User (No Email Verification)
// -------------------------
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already in use..." });

        // const hashed = await bcrypt.hash(password, 12);

        // Directly create user without verifyToken
        const user = new User({ name, email, password, isVerified: true });
        await user.save();

        res.json({ message: "Registration successful. You can now log in." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};

// -------------------------
// Login
// -------------------------
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({ error: "User not found" });

        // ⛔ Remove verification check
        // if (!user.isVerified) return res.status(401).json({ error: "Please verify your email first" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
            expiresIn: "1d",
        });

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
