const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password, nowa } = req.body;  // terima nowa

    if (!username || !password)
      return res.status(400).json({ status: 'error', message: "username & password required" });

    // opsional: cek nomor WA sudah dipakai atau belum
    if (nowa) {
      const existNowa = await User.findOne({ where: { nowa } });
      if (existNowa) return res.status(409).json({ status: 'error', message: "Nomor WhatsApp sudah terdaftar" });
    }

    const existUser = await User.findOne({ where: { username } });
    if (existUser) return res.status(409).json({ status: 'error', message: "username already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = req.file ? req.file.buffer : null;

    const user = await User.create({
      username,
      password: hashedPassword,
      avatar,
      nowa, // simpan nowa
    });

    res.status(201).json({ status: 'ok', data: { id: user.id, username: user.username, nowa: user.nowa } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ status: 'error', message: "username & password required" });

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ status: 'error', message: "Invalid username or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ status: 'error', message: "Invalid username or password" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: 'ok', data: { id: user.id, username: user.username, token } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({ status: 'ok', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ status: 'error', message: "User not found" });
    res.status(200).json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, nowa } = req.body;  // terima nowa
    const avatar = req.file ? req.file.buffer : null;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: "User not found" });

    if (nowa && nowa !== user.nowa) {
      const existNowa = await User.findOne({ where: { nowa } });
      if (existNowa) return res.status(409).json({ status: 'error', message: "Nomor WhatsApp sudah terdaftar" });
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      username: username || user.username,
      password: hashedPassword,
      nowa: nowa || user.nowa,  // update nowa
      ...(avatar && { avatar }),
    });

    res.status(200).json({ status: 'ok', data: { id: user.id, username: user.username, nowa: user.nowa } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: "User not found" });

    await user.destroy();
    res.status(200).json({ status: 'ok', message: "User deleted" });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getUserAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || !user.avatar) return res.status(404).json({ status: 'error', message: "Avatar not found" });

    res.set("Content-Type", "image/jpeg");
    res.status(200).send(user.avatar);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
