const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/movieController");

router.post("/upload", upload.single("file"), uploadImage);

module.exports = router;
