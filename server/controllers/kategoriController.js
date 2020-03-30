// import model
const Kategori = require('../models/kategoriModel')


// get all kategori
exports.getKategori = async (req, res, next) => {

    const kategori = await Kategori.find();

    res.status(200).json({
        success: true,
        results : jobs.length,
        data: kategori
    });
}

