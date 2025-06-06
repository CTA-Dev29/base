const { Profile, User } = require("../models");

exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      include: [{ model: User, attributes: ["email"] }],
      distinct: true,
    });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["email"] }],
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProfile = async (req, res) => {
  try {
    // Pastikan userId dikirim dari body atau dari token (disesuaikan)
    const { fullName, age, userId } = req.body;
    const profile = await Profile.create({ fullName, age, userId });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const { fullName, age } = req.body;
    await profile.update({ fullName, age });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    await profile.destroy();
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
