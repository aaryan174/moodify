const Playlist = require("../model/playlist.model");
const songModel = require("../model/songs.model");

async function createPlaylistController(req, res) {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Playlist name is required" });

        const playlist = await Playlist.create({
            name,
            owner: req.user.id,
            tracks: []
        });

        res.status(201).json({ message: "Playlist created", playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create playlist" });
    }
}

async function getUserPlaylistsController(req, res) {
    try {
        const playlists = await Playlist.find({ owner: req.user.id }).populate('tracks');
        res.status(200).json({ playlists });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch playlists" });
    }
}

async function getPlaylistController(req, res) {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id).populate('tracks');
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        if (playlist.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });
        res.status(200).json({ playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch playlist" });
    }
}

async function addTrackController(req, res) {
    try {
        const { id } = req.params; // playlist id
        const { trackId } = req.body;
        if (!trackId) return res.status(400).json({ message: "trackId is required" });

        const playlist = await Playlist.findById(id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        if (playlist.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        const song = await songModel.findById(trackId);
        if (!song) return res.status(404).json({ message: "Song not found" });

        // avoid duplicates
        if (!playlist.tracks.includes(trackId)) {
            playlist.tracks.push(trackId);
            await playlist.save();
        }

        res.status(200).json({ message: "Track added", playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add track" });
    }
}

async function removeTrackController(req, res) {
    try {
        const { id } = req.params; // playlist id
        const { trackId } = req.body;
        if (!trackId) return res.status(400).json({ message: "trackId is required" });

        const playlist = await Playlist.findById(id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        if (playlist.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        playlist.tracks = playlist.tracks.filter(t => t.toString() !== trackId);
        await playlist.save();

        res.status(200).json({ message: "Track removed", playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove track" });
    }
}

async function deletePlaylistController(req, res) {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        if (playlist.owner.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        await playlist.remove();
        res.status(200).json({ message: "Playlist deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete playlist" });
    }
}

module.exports = {
    createPlaylistController,
    getUserPlaylistsController,
    getPlaylistController,
    addTrackController,
    removeTrackController,
    deletePlaylistController
}
