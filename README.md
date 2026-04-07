# 🎬 Advanced Movie API

Sebuah RESTful API tangguh yang dibangun menggunakan Node.js dan Express.js. Proyek ini mendemonstrasikan implementasi _backend_ tingkat lanjut, termasuk keamanan autentikasi, verifikasi email otomatis, manipulasi _file upload_, dan kueri database yang kompleks.

Proyek ini dibangun sebagai penyelesaian untuk **Mission Advanced 1B**.

## ✨ Fitur Utama

- **🔐 Autentikasi & Keamanan:** Registrasi dan Login aman menggunakan enkripsi sandi `bcrypt` dan otorisasi berbasis _JSON Web Token_ (JWT).
- **✉️ Verifikasi Email Otomatis:** Integrasi _Nodemailer_ (via Ethereal Mail) untuk mengirimkan tautan verifikasi akun satu kali pakai (_one-time use_) saat pendaftaran pengguna baru.
- **🔍 Advanced Fetching (Kueri Kompleks):** _Endpoint_ dinamis yang mendukung parameter _search_ (pencarian judul), _filter_ (berdasarkan genre), dan _sorting_ (pengurutan data).
- **📁 Secure File Upload:** Fitur unggah gambar (_multipart/form-data_) menggunakan `multer` yang dilindungi oleh otorisasi _middleware_ JWT.
- **🏗️ Arsitektur MVC:** Basis kode terstruktur dengan rapi yang memisahkan _Config, Controllers, Middleware_, dan _Routes_ untuk skalabilitas.

## 🛠️ Tech Stack

- **Lingkungan:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (dengan `mysql2/promise`)
- **Keamanan:** `bcrypt` (Hashing), `jsonwebtoken` (Auth)
- **Utilitas:** `multer` (File Upload), `nodemailer` (Email Service), `dotenv` (Environment Variables)

## 🚀 Cara Instalasi & Menjalankan Aplikasi

### 1. **Clone repository ini**

```bash
git clone https://github.com/SirYazoo/advanced-movie-api.git
cd advanced-movie-api
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Setup Database**

- Buat database baru di MySQL dengan nama `advanced_movie_db`.
- Jalankan _query_ pembuatan tabel `users` dan `movies` (sesuai skema proyek).

### 4. **Konfigurasi Environment Variables**

Buat file `.env` di _root directory_ dan isi dengan variabel berikut:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=advanced_movie_db

JWT_SECRET=rahasia_token_anda

# Gunakan akun Ethereal Mail untuk testing
EMAIL_USER=email_ethereal_anda@ethereal.email
EMAIL_PASS=password_ethereal_anda
```

### 5. **Jalankan Server**

```bash
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint        | Deskripsi                                                       | Auth Required |
| ------ | --------------- | --------------------------------------------------------------- | ------------- |
| `POST` | `/register`     | Mendaftarkan akun baru dan mengirim email verifikasi            | ❌            |
| `GET`  | `/verify-email` | Memverifikasi akun via token dari URL email                     | ❌            |
| `POST` | `/login`        | Autentikasi user & mengembalikan token JWT                      | ❌            |
| `GET`  | `/movie`        | Mengambil data film (mendukung `?search`, `?genre`, `?sortBy`)" | ❌            |
| `POST` | `/upload`       | Mengunggah file gambar ke server lokal                          | ✅ (Bearer)   |
