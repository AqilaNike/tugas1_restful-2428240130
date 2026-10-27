const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  judul: { 
    type: String, 
    required: [true, 'judul wajib diisi'], 
    trim: true 
  },
  deskripsi: { 
    type: String, 
    trim: true,
    default: '' 
  },
  prioritas: { 
    type: String, 
    required: [true, 'prioritas wajib diisi'], 
    enum: ['rendah', 'sedang', 'tinggi'],
    default: 'sedang'
  },
  tenggat: { 
    type: Date, 
    required: [true, 'tenggat wajib diisi'] 
  },
  selesai: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Task', taskSchema);