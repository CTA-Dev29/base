const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { register, login, deleteUser, getUserById, updateUser,getUserAvatar,getAllUsers } = require("../controllers/authController");

const upload = require("../utils/multer");

// login
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

// Protected
router.get("/", auth, getAllUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, upload.single("avatar"), updateUser);
router.delete("/:id", auth, deleteUser);
router.get("/:id/avatar", auth, getUserAvatar);
module.exports = router;
