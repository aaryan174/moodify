const express = require("express");
const upload = require("../middleware/upload.middleware");
const { uploadSongController } = require("../controller/songs.controller");


const router = express.Router();


router.post("/", upload.single("song"), uploadSongController )



module.exports = router;