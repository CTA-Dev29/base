const { Tugas, matkul } = require("../models");

exports.getAlltugass = async (req, res) => {
  try {
    const tugass = await Tugas.findAll({
      include: [{ model: matkul, attributes: ["nama"] }],
      distinct: true,
    });
    res.json({ status: "ok", data: tugass });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

exports.getTugasById = async (req, res) => {
  try {
    const Tugass = await Tugas.findByPk(req.params.id, {
      include: [{ model: matkul, attributes: ["nama"] }],
    });
    if (!Tugass)
      return res.status(404).json({ status: "error", error: "Tugas not found" });
    res.json({ status: "ok", data: Tugass });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

exports.createTugas = async (req, res) => {
  try {
    const { judul, id_matkul } = req.body;
    const Tugass = await Tugas.create({ judul, id_matkul });
    res.status(201).json({ status: "ok", data: Tugass });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

exports.updateTugas = async (req, res) => {
  try {
    const Tugass = await Tugas.findByPk(req.params.id);
    if (!Tugass)
      return res.status(404).json({ status: "error", error: "Tugas not found" });

    const { judul, id_matkul } = req.body;
    await Tugass.update({ judul, id_matkul });
    // reload data terbaru setelah update
    await Tugass.reload({ include: [{ model: matkul, attributes: ["nama"] }] });

    res.json({ status: "ok", data: Tugass });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

exports.deleteTugas = async (req, res) => {
  try {
    const Tugass = await Tugas.findByPk(req.params.id);
    if (!Tugass)
      return res.status(404).json({ status: "error", error: "Tugas not found" });

    await Tugass.destroy();
    res.json({ status: "ok", message: "Tugas deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
