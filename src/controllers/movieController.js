const db = require("../config/db");

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

const getAllMovies = async (req, res) => {
  try {
    const { search, genre, sortBy } = req.query;

    let query = "SELECT * FROM movies WHERE 1 = 1";
    let queryParams = [];

    if (search) {
      query += " AND judul LIKE ?";
      queryParams.push(`%${search}%`);
    }

    if (genre) {
      query += " AND genre = ?";
      queryParams.push(genre);
    }

    if (sortBy) {
      const allowedSortColumns = ["judul", "id", "rating_usia"];
      const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : "id";

      query += ` ORDER BY ${sortColumn} ASC`;
    } else {
      query += " ORDER BY id ASC";
    }

    const [movies] = await db.query(query, queryParams);
    res
      .status(200)
      .json({
        success: true,
        message: "Berhasil mengambil data film",
        data: movies,
      });
  } catch (error) {
    console.error("Error Get Movies:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan internal server" });
  }
};

module.exports = { uploadImage, getAllMovies };
