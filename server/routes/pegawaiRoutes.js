const express = require('express')
const router = express.Router();

// import pegawai controller
const { getPegawai } = require('../controllers/pegawaiController');

router.route('/pegawai').get(getPegawai)

module.exports = router;