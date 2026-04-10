const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const transporter = require("../config/mailer");

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fullname, Email, dan password wajib diisi!",
      });
    }

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email sudah terdaftar!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = uuidv4();

    await db.query(
      "INSERT INTO users (fullname, email, password, verification_token) VALUES (?, ?, ?, ?)",
      [fullname, email, hashedPassword, verificationToken],
    );

    const verificationLink = `http://localhost:${process.env.PORT || 3000}/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifikasi Akun Advanced Movie API",
      html: `
                <h3>Halo, ${fullname}!</h3>
                <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk mengaktifkan akun Anda:</p>
                <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Verifikasi Akun Saya</a>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Silakan cek email Anda untuk verifikasi.",
      data: { fullname, email },
    });
  } catch (error) {
    console.error("Error Register:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan internal server" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email dan password wajib diisi!" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah!" });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Akun belum diverifikasi. Silakan cek email Anda!",
      });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login berhasil!",
      token: token,
    });
  } catch (error) {
    console.error("Error Login:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan internal server" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token tidak valid!" });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE verification_token = ?",
      [token],
    );
    const user = users[0];

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token tidak ditemukan atau sudah digunakan!",
      });
    }

    await db.query(
      "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?",
      [user.id],
    );

    res.status(200).send(`
            <h2 style="color: green; font-family: sans-serif; text-align: center; margin-top: 50px;">
                Email Anda berhasil diverifikasi! Silakan kembali ke aplikasi untuk Login.
            </h2>
        `);
  } catch (error) {
    console.error("Error Verify Email:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan internal server" });
  }
};

module.exports = { register, login, verifyEmail };
