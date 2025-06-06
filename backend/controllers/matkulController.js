const { matkul } = require("../models");

// GET / - Ambil semua mata kuliah
exports.getAllmatkuls = async (req, res) => {
  try {
    const matkuls = await matkul.findAll();
    res.json({ status: 'ok', data: matkuls });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /:id - Ambil satu data berdasarkan ID
exports.getmatkulById = async (req, res) => {
  try {
    const matkuls = await matkul.findByPk(req.params.id);
    if (!matkuls) {
      return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
    }
    res.json({ status: 'ok', data: matkuls });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST / - Buat data baru
exports.creatematkul = async (req, res) => {
  try {
    const { nama, kode, sks, dosen } = req.body;
    const newmatkul = await matkul.create({ nama, kode, sks, dosen });
    res.status(201).json({ status: 'success', data: newmatkul });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// PUT /:id - Update data
exports.updatematkul = async (req, res) => {
  try {
    const { nama, kode, sks, dosen } = req.body;
    const matkuls = await matkul.findByPk(req.params.id);
    if (!matkuls) {
      return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
    }

    await matkul.update({ nama, kode, sks, dosen });
    res.json({ status: 'success', data: matkuls});
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
    console.log(req.body)
  }
};

// DELETE /:id - Hapus data
exports.deletematkul = async (req, res) => {
  try {
    const matkul = await matkul.findByPk(req.params.id);
    if (!matkul) {
      return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
    }

    await matkul.destroy();
    res.json({ status: 'success', message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};