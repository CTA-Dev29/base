const { Jawaban, User, Tugas } = require('../models')

// Ambil semua jawaban berdasarkan id_tugas
exports.getJawabanByTugasId = async (req, res) => {
  try {
    const jawaban = await Jawaban.findAll({
      where: { id_tugas: req.params.id_tugas },
      include: [
        { model: User, attributes: ['nama', 'nim'] },
        { model: Tugas, attributes: ['judul'] },
      ],
    })
    res.json({ status: 'ok', data: jawaban })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// Ambil jawaban by ID
exports.getJawabanById = async (req, res) => {
  try {
    const jawaban = await Jawaban.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['nama', 'email'] },
        { model: Tugas, attributes: ['judul'] },
      ],
    })
    if (!jawaban) {
      return res.status(404).json({ status: 'error', message: 'Jawaban not found' })
    }
    res.json({ status: 'ok', data: jawaban })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// Create jawaban
exports.createJawaban = async (req, res) => {
  try {
    const { id_user, id_tugas } = req.body
    const file = req.file?.buffer || null // jika pakai upload file via middleware seperti multer

    const newJawaban = await Jawaban.create({
      id_user,
      id_tugas,
      file,
    })

    res.status(201).json({ status: 'ok', data: newJawaban })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// Update jawaban
exports.updateJawaban = async (req, res) => {
  try {
    const jawaban = await Jawaban.findByPk(req.params.id)
    if (!jawaban) {
      return res.status(404).json({ status: 'error', message: 'Jawaban not found' })
    }

    const { id_user, id_tugas } = req.body
    const file = req.file?.buffer || jawaban.file

    await jawaban.update({ id_user, id_tugas, file })
    res.json({ status: 'ok', data: jawaban })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// Delete jawaban
exports.deleteJawaban = async (req, res) => {
  try {
    const jawaban = await Jawaban.findByPk(req.params.id)
    if (!jawaban) {
      return res.status(404).json({ status: 'error', message: 'Jawaban not found' })
    }

    await jawaban.destroy()
    res.json({ status: 'ok', message: 'Jawaban deleted' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}
