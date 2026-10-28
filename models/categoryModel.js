const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama kategori wajib diisi'],
    unique: true,
    trim: true
  },
  deskripsi: {
    type: String,
    trim: true,
    default: ''
  },
  warna: {
    type: String,
    default: '#6c757d' // Kode warna label kategori (misal: hex code)
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);