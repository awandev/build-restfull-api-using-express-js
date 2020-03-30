// import model
const Pegawai = require('../models/pegawaiModel')


// get all pegawai
exports.getPegawai = async (req, res, next) => {

    const pegawai = await Pegawai.find();

    res.status(200).json({
        success: true,
        results : pegawai.length,
        data : pegawai
    });
}

exports.newPegawai = async(req, res, next) => {
    const pegawai = await Pegawai.create(req.body);
    res.status(200).json({
        success : true,
        message : 'Pegawai Telah Dibuat',
        data : pegawai
    });
}

exports.getDetailPegawai = async(req, res, next) => {
    const pegawai = await Pegawai.findById(req.params.id);
    if (!pegawai) {
        return res.status(404).json({
            success : false,
            message : 'pegawai not found'
        });
    }

    res.status(200).json({
        success : true,
        data : job
    });
}

exports.updatePegawai = async(req, res, next) => {
    const pegawai = await Pegawai.findById(req.params.id);
    if(!job) {
        return res.status(404).json({
            success : false,
            message: 'Pegawai Tidak Ditemukan'
        });
    }

    pegawai = await Pegawai.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success : true,
        message : 'Job is updated',
        data : pegawai
    })
}

exports.deletePegawai = async(req, res, next) => {
    let pegawai = await Pegawai.findById(req.params.id);
    if(!pegawai) {
        return res.status(404).json({
            success : false,
            message : 'Pegawai Tidak Ditemukan'
        })
    }

    pegawai = await Pegawai.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success : true,
        message : 'Data Pegawai Telah Dihapus'
    })
}