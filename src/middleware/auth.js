const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak! Token tidak ditemukan.",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(403).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa!",
    });
  }
};

module.exports = verifyToken;
