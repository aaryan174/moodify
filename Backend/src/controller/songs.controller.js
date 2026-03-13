const songModel = require("../model/songs.model");
const id3 = require("node-id3");

async function uploadSongController(req, res) {
    const songBuffer = req.file.buffer;

    const tags = id3.read(songBuffer)
    console.log(tags);
    
}


module.exports = {
    uploadSongController
}