const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");

// Semua route ini butuh autentikasi (misal)
router.get("/", auth, profileController.getAllProfiles);
router.get("/:id", auth, profileController.getProfileById);
router.post("/", auth, profileController.createProfile);
router.put("/:id", auth, profileController.updateProfile);
router.delete("/:id", auth, profileController.deleteProfile);

module.exports = router;
