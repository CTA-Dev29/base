const multer = require("multer");

// Simpan file di memori (bisa juga diganti ke disk jika perlu)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB
  },
  fileFilter: (req, file, cb) => {
    // Hanya terima gambar
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
