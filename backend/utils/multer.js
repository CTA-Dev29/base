const multer = require("multer");

// Simpan file di memori (bisa juga diganti ke disk jika perlu)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB
  },
  fileFilter: (req, file, cb) => {
    // Terima file gambar atau PDF
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files or PDF are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
