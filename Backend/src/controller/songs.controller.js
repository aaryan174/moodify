const songModel = require("../model/songs.model");
const storageService = require("../services/storage.service");

async function uploadSongController(req, res) {
    try {
        const { title, mood } = req.body;

        if (!req.files || !req.files['song'] || !req.files['poster']) {
            return res.status(400).json({ message: "Both song and poster files are required" });
        }

        const songBuffer = req.files['song'][0].buffer;
        const posterBuffer = req.files['poster'][0].buffer;

        // Ensure title exists to construct filenames
        const safeTitle = title ? title.replace(/[^a-zA-Z0-9\s]/g, "") : "Unknown_Title";

        const [songFile, posterFile] = await Promise.all([
            storageService.uploadFile({
                buffer: songBuffer,
                filename: `${safeTitle}_${Date.now()}.mp3`,
                folder: "/moodify/songs"
            }),
            storageService.uploadFile({
                buffer: posterBuffer,
                filename: `${safeTitle}_${Date.now()}.jpeg`, // Keep extension generic or grab from originalname
                folder: "/moodify/posters"
            })
        ]);

        const song = await songModel.create({
            title: title || "Unknown Title",
            url: songFile.url,
            posterUrl: posterFile.url,
            mood
        });

        res.status(201).json({
            message: "song created successfully",
            song
        });
    } catch (error) {
        console.error("Error uploading song:", error);
        res.status(500).json({ message: "Failed to upload song", error: error.message });
    }
}

async function getSongController(req, res) {
    try {
        // Keeps the existing random or single mood fetch functionality
        const { mood } = req.query;
        let query = {};
        if (mood) query.mood = mood;

        const song = await songModel.findOne(query);

        res.status(200).json({
            message: "song Fetched successfully",
            song
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching song" });
    }
}

async function getAllSongsController(req, res) {
    try {
        const songs = await songModel.find().sort({ _id: -1 }); // Get newest first
        res.status(200).json({
            message: "All songs fetched successfully",
            songs
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch all songs", error: error.message });
    }
}

module.exports = {
    uploadSongController,
    getSongController,
    getAllSongsController
}