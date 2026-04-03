const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File gambar wajib diunggah!",
      });
    }

    const imageUrl = `http://localhost:${process.env.PORT || 3000}/upload/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Gambar berhasil diunggah",
      data: {
        filename: req.file.filename,
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Error Upload:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan internal server" });
  }
};

module.exports = { uploadImage };
