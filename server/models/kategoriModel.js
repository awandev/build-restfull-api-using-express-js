const mongoose = require('mongoose')
const slugify = require('slugify')
const kategoriSchema = new mongoose.Schema({
    nama : {
        type : String,
        required : [true, 'Mohon Masukkan Data Kategori'],
        trim: true
    }
});

module.exports = mongoose.model('Kategori', kategoriSchema);