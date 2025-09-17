import User from "../../models/User.js";

// Add points to a user (Admin only)
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

// Leaderboard
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
