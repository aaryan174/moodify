const express = require("express");
const upload = require("../middleware/upload.middleware");
const { uploadSongController, getSongController, getAllSongsController, searchSongController } = require("../controller/songs.controller");

const router = express.Router();

// Allow both song (.mp3) and poster (.jpeg/.png) in multi-part form
router.post("/", upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'poster', maxCount: 1 }
]), uploadSongController);

router.get("/", getSongController);
router.get("/all", getAllSongsController);
router.get("/search", searchSongController);

module.exports = router;
