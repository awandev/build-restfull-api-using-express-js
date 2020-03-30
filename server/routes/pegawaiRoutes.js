const express = require('express')
const router = express.Router();

// import pegawai controller
const { 
    getPegawai,
    getDetailPegawai,
    newPegawai,
    updatePegawai,
    deletePegawai 
} = require('../controllers/pegawaiController');

router.route('/pegawai').get(getPegawai);
router.route('/pegawai/:id').get(getDetailPegawai);
router.route('/pegawai/new').post(newPegawai)
router.route('/pegawai/:id')
    .put(updatePegawai)
    .delete(deletePegawai);

module.exports = router;