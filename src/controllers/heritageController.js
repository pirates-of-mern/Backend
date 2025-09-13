import Heritage from "../models/Heritage.js";

// Get all heritages
export const getHeritages = async (req, res) => {
    try {
        const heritages = await Heritage.find();
        res.json(heritages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single heritage by ID
export const getHeritageById = async (req, res) => {
    try {
        const heritage = await Heritage.findById(req.params.id);
        if (!heritage) {
            return res.status(404).json({ message: "Heritage not found" });
        }
        res.json(heritage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add heritage (admin)
export const addHeritage = async (req, res) => {
    try {
        const heritage = new Heritage(req.body);
        await heritage.save();
        res.json({ message: "Heritage added", heritage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update heritage (admin)
export const updateHeritage = async (req, res) => {
    try {
        const heritage = await Heritage.findByIdAndUpdate(
            req.params.id,
            { ...req.body, last_updated: Date.now() },
            { new: true, runValidators: true }
        );

        if (!heritage) {
            return res.status(404).json({ message: "Heritage not found" });
        }

        res.json({ message: "Heritage updated", heritage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete heritage (admin)
export const deleteHeritage = async (req, res) => {
    try {
        const heritage = await Heritage.findByIdAndDelete(req.params.id);
        if (!heritage) {
            return res.status(404).json({ message: "Heritage not found" });
        }
        res.json({ message: "Heritage deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
