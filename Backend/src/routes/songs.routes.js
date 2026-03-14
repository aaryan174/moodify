const express = require("express");
const upload = require("../middleware/upload.middleware");
const { uploadSongController, getSongController } = require("../controller/songs.controller");


const router = express.Router();


router.post("/", upload.single("song"), uploadSongController)
router.get("/", getSongController)


module.exports = router;