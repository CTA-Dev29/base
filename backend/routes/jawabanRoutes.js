const express = require('express')
const router = express.Router()
const jawabanController = require('../controllers/jawabanController')
const upload = require("../utils/multer");

router.get('/tugas/:id_tugas', jawabanController.getJawabanByTugasId)
router.get('/:id', jawabanController.getJawabanById)
router.post('/', upload.single('file'), jawabanController.createJawaban)
router.put('/:id', upload.single('file'), jawabanController.updateJawaban)
router.delete('/:id', jawabanController.deleteJawaban)

module.exports = router
