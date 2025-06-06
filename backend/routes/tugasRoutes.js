const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const tugasController = require("../controllers/tugasController");

// Semua route ini butuh autentikasi (misal)
router.get("/", auth, tugasController.getAlltugass);
router.get("/:id", auth, tugasController.getTugasById);
router.post("/", auth, tugasController.createTugas);
router.put("/:id", auth, tugasController.updateTugas);
router.delete("/:id", auth, tugasController.deleteTugas);

module.exports = router;
