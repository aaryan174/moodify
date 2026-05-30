const NodeID3 = require("node-id3");
const songModel = require("../model/songs.model");
const storageService = require("../services/storage.service");

async function uploadSongController(req, res) {
    try {
        const { title, mood } = req.body;

        if (!req.files || !req.files['song']) {
            return res.status(400).json({ message: "Song file is required" });
        }

        const songBuffer = req.files['song'][0].buffer;
        const safeTitle = title ? title.replace(/[^a-zA-Z0-9\s]/g, "") : "Unknown_Title";

        // Determine poster buffer: use uploaded file or fall back to ID3 tag
        let posterBuffer = null;
        if (req.files['poster'] && req.files['poster'][0]) {
            posterBuffer = req.files['poster'][0].buffer;
        } else {
            // Extract cover art from ID3 tags
            const tags = NodeID3.read(songBuffer);
            if (tags && tags.image && tags.image.imageBuffer) {
                posterBuffer = tags.image.imageBuffer;
            }
        }

        // Upload song (always) and poster (if available) in parallel
        const uploads = [
            storageService.uploadFile({
                buffer: songBuffer,
                filename: `${safeTitle}_${Date.now()}.mp3`,
                folder: "/moodify/songs"
            })
        ];

        if (posterBuffer) {
            uploads.push(
                storageService.uploadFile({
                    buffer: posterBuffer,
                    filename: `${safeTitle}_${Date.now()}.jpeg`,
                    folder: "/moodify/posters"
                })
            );
        }

        const results = await Promise.all(uploads);
        const songFile = results[0];
        const posterFile = results[1] || null;

        const song = await songModel.create({
            title: title || "Unknown Title",
            url: songFile.url,
            posterUrl: posterFile ? posterFile.url : null,
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
        const { mood } = req.query;
        let song = null;

        if (mood) {
            const results = await songModel.aggregate([
                { $match: { mood } },
                { $sample: { size: 1 } }
            ]);
            song = results[0] || null;
        } else {
            const results = await songModel.aggregate([
                { $sample: { size: 1 } }
            ]);
            song = results[0] || null;
        }

        // Fallback to iTunes API if no local song is found
        if (!song && mood) {
            console.log(`No local song found for mood "${mood}". Fetching from iTunes API...`);
            const moodQueries = {
                happy: "happy upbeat energy",
                sad: "sad acoustic mellow emotional",
                surprised: "dynamic energetic electronic dance"
            };
            const searchTerm = moodQueries[mood.toLowerCase()] || mood;
            
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=10`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                const track = data.results[randomIndex];
                song = {
                    _id: `external-${track.trackId}`,
                    title: track.trackName,
                    artist: track.artistName,
                    url: track.previewUrl,
                    posterUrl: track.artworkUrl100.replace("100x100bb", "500x500bb"),
                    mood: mood
                };
            }
        }

        res.status(200).json({
            message: "song Fetched successfully",
            song
        });
    } catch (error) {
        console.error("Error fetching song:", error);
        res.status(500).json({ message: "Error fetching song", error: error.message });
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

async function searchSongController(req, res) {
    try {
        const { title } = req.query;

        // validate input
        if (!title) {
            return res.status(400).json({
                message: "title query is required"
            });
        }

        // search songs (case insensitive + partial match)
        const songs = await songModel.find({
            title: { $regex: title, $options: "i" }
        });

        // check if songs exist
        if (songs.length === 0) {
            return res.status(404).json({
                message: "song not found"
            });
        }

        res.status(200).json({
            message: "songs fetched successfully",
            songs
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            message: "Failed to search songs",
            error: error.message
        });
    }
}

async function getSongsByMoodController(req, res) {
    try {
        const { mood } = req.query;
        if (!mood) {
            return res.status(400).json({ message: "Mood query is required" });
        }

        // 1. Get all local songs matching this mood
        let songs = await songModel.find({ mood }).sort({ _id: -1 });

        // 2. Fetch iTunes songs to fill/extend the queue
        const moodQueries = {
            happy: "happy upbeat energy",
            sad: "sad acoustic mellow emotional",
            surprised: "dynamic energetic electronic dance"
        };
        const searchTerm = moodQueries[mood.toLowerCase()] || mood;

        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=15`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const externalSongs = data.results.map((track) => ({
                    _id: `external-${track.trackId}`,
                    title: track.trackName,
                    artist: track.artistName,
                    url: track.previewUrl,
                    posterUrl: track.artworkUrl100.replace("100x100bb", "500x500bb"),
                    mood: mood
                }));

                // Combine local and external, filtering duplicates
                const localTitles = new Set(songs.map(s => s.title.toLowerCase()));
                const uniqueExternal = externalSongs.filter(e => !localTitles.has(e.title.toLowerCase()));
                
                songs = [...songs, ...uniqueExternal];
            }
        } catch (apiError) {
            console.error("Error fetching from iTunes API:", apiError);
        }

        res.status(200).json({
            message: "Songs for mood fetched successfully",
            songs
        });
    } catch (error) {
        console.error("Error in getSongsByMoodController:", error);
        res.status(500).json({ message: "Failed to fetch songs by mood", error: error.message });
    }
}

module.exports = {
    uploadSongController,
    getSongController,
    getAllSongsController,
    searchSongController,
    getSongsByMoodController
}