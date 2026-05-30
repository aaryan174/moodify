const router = require("express").Router();
const userAuth = require("../middleware/userAuth.middleware");
const playlists = require("../controller/playlists.controller");

router.post("/", userAuth, playlists.createPlaylistController);
router.get("/", userAuth, playlists.getUserPlaylistsController);
router.get("/:id", userAuth, playlists.getPlaylistController);
router.post("/:id/tracks", userAuth, playlists.addTrackController);
router.delete("/:id/tracks", userAuth, playlists.removeTrackController);
router.delete("/:id", userAuth, playlists.deletePlaylistController);

module.exports = router;
