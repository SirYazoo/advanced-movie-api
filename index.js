require("dotenv").config();
const express = require("express");
const db = require("./src/config/db");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/upload", express.static("upload"));
const movieRoutes = require("./src/routes/movieRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/", movieRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Server Advanced Movie API Berjalan!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
