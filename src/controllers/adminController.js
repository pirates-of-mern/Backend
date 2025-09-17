import User from "../models/User.js";

// Promote a user to admin
export const promoteToAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const requester = req.user;

        if (!requester) return res.status(401).json({ error: "Not authenticated" });

        // Only owner OR admin-with-permission can promote:
        if (requester.role !== "owner" && !requester.permissions.includes("manage_users")) {
            return res.status(403).json({ error: "Insufficient permission" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Prevent changing the owner accidentally
        if (user.role === "owner") {
            return res.status(400).json({ error: "Cannot change owner role" });
        }

        user.role = "admin";
        await user.save();

        res.json({ message: "User promoted to admin", user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Promotion failed" });
    }
};

// Demote admin -> user
export const demoteFromAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const requester = req.user;
        if (requester.role !== "owner" && !requester.permissions.includes("manage_users")) {
            return res.status(403).json({ error: "Insufficient permission" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.role === "owner") return res.status(400).json({ error: "Cannot demote owner" });

        user.role = "user";
        user.permissions = [];
        await user.save();

        res.json({ message: "User demoted to user", user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Demotion failed" });
    }
};

// Set permissions (owner/admin with permission)
export const setPermissions = async (req, res) => {
    try {
        const { id } = req.params; // user id to modify
        const { permissions } = req.body; // array of permission strings

        if (!Array.isArray(permissions)) return res.status(400).json({ error: "permissions must be array" });

        const requester = req.user;
        if (requester.role !== "owner" && !requester.permissions.includes("manage_users")) {
            return res.status(403).json({ error: "Insufficient permission" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.role === "owner") return res.status(400).json({ error: "Cannot modify owner permissions" });

        // Optionally validate allowed permission strings
        const allowed = ["manage_heritages", "manage_users", "manage_content", "view_reports"];
        user.permissions = permissions.filter(p => allowed.includes(p));
        await user.save();

        res.json({ message: "Permissions updated", permissions: user.permissions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to set permissions" });
    }
};

// Get all users (admin/owner)
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
