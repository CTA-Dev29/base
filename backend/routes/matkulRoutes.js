const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const matkulController = require("../controllers/matkulController");

// Semua route ini butuh autentikasi (misal)
router.get("/", auth, matkulController.getAllmatkuls);
router.get("/:id", auth, matkulController.getmatkulById);
router.post("/", auth, matkulController.creatematkul);
router.put("/:id", auth, matkulController.updatematkul);
router.delete("/:id", auth, matkulController.deletematkul);

module.exports = router;