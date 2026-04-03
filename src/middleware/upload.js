const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./upload";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replaceAll(/\s+/g, "_");
    cb(null, uniqueSuffix + "-" + safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Format tidak valid! Silakan unggah file gambar."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
