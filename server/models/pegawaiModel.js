const mongoose = require('mongoose')
const validator = require('validator')
const slugify = require('slugify')

const pegawaiSchema = new mongoose.Schema({
    nip : {
        type : String,
        required: [true, 'Mohon Masukkan Nip'],
        trim: true,
        maxlength: [20, 'Nip Tidak boleh melebihi 20 karakter']
    },
    nama : {
        type : String,
        required : [true, 'Mohon Masukkan Nama Pegawai'],
        maxlength: [100, 'Nama Pegawai Tidak boleh melebihi 100 Karakter']
    },
    jenisKelamin : {
        type : String,
        required : true,
        enum : {
            values : [
                'Laki-laki',
                'Perempuan'
            ],
            message : 'Mohon Pilih Jenis Kelamin'
        }
    }
});

module.exports = mongoose.model('Pegawai', pegawaiSchema);