const mongoose = require('mongoose');

// EMBEDDING: Sub-dokumen Catatan/Komentar Task
const commentSchema = new mongoose.Schema({
  teks: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  judul: { 
    type: String, 
    required: [true, 'Judul wajib diisi'], 
    trim: true 
  },
  deskripsi: { 
    type: String, 
    trim: true,
    default: '' 
  },
  prioritas: { 
    type: String, 
    enum: ['rendah', 'sedang', 'tinggi'], 
    default: 'sedang' 
  },
  tenggat: { 
    type: Date, 
    required: [true, 'Tenggat wajib diisi'] 
  },
  selesai: { 
    type: Boolean, 
    default: false 
  },

  // REFERENCING: Menghubungkan Task ke Kategori
  kategori: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori wajib diisi']
  },

  // EMBEDDING: Array catatan di dalam dokumen Task
  catatan: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);