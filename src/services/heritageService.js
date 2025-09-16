import HeritageSite from "../models/Heritage.js";

export async function searchHeritage(query) {
    // 1. Break query into words, remove छोटे words
    const words = query.split(/\s+/).filter(w => w.length > 2);

    // 2. Create regex array for each word
    const regexArr = words.map(w => new RegExp(w, "i"));

    // 3. Search if any word matches
    return await HeritageSite.find({
        $or: [
            { name: { $in: regexArr } },
            { "location.city": { $in: regexArr } },
            { "location.state": { $in: regexArr } },
            { tags: { $in: regexArr } },
        ],
    }).limit(3);
}
