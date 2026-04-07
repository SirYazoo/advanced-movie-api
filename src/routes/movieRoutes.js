const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadImage, getAllMovies } = require("../controllers/movieController");

router.post("/upload", upload.single("file"), uploadImage);

router.get("/movie", getAllMovies);

module.exports = router;
