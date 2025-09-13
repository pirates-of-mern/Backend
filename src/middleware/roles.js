export const adminMiddleware = (req, res, next) => {
    const user = req.user; // assume authMiddleware set req.user
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (user.role === "admin" || user.role === "owner") return next();
    return res.status(403).json({ error: "Admin access required" });
};

export const ownerMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (user.role === "owner") return next();
    return res.status(403).json({ error: "Owner access required" });
};
