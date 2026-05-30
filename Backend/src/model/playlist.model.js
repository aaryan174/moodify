const mongoose = require("mongoose")

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "songs"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const playlistModel = mongoose.model("playlist", playlistSchema)

module.exports = playlistModel;
