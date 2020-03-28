const express = require('express')
const router = express.Router();
const { getKategori } = require('../controllers/kategoriController')

router.route('/kategori').get(getKategori);

module.exports = router;

