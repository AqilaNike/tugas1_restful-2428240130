// seed.js
// Mengisi basis data dengan 3 kategori dan 10 tugas. Aman dijalankan berulang:
// data lama dihapus terlebih dahulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');
const Task = require('./models/taskModel');

const DUMMY_TASKS = [
  { judul: 'Desain Wireframe UI/UX', deskripsi: 'Buat mockup untuk halaman Dashboard', prioritas: 'tinggi', tenggat: '2026-11-05' },
  { judul: 'Setup MongoDB Atlas', deskripsi: 'Konfigurasi cluster dan buat koneksi URI', prioritas: 'tinggi', tenggat: '2026-11-02' },
  { judul: 'Membuat Document Schema Mongoose', deskripsi: 'Rancang skema Task dan Category', prioritas: 'sedang', tenggat: '2026-11-03' },
  { judul: 'Implementasi Restful API CRUD', deskripsi: 'Buat controller dan routing lengkap', prioritas: 'tinggi', tenggat: '2026-11-06' },
  { judul: 'Integrasi Express Middleware', deskripsi: 'Pasang logger, cors, dan errorHandler', prioritas: 'rendah', tenggat: '2026-11-08' },
  { judul: 'Pengujian Endpoint di Postman', deskripsi: 'Uji GET, POST, PUT, dan DELETE', prioritas: 'sedang', tenggat: '2026-11-09' },
  { judul: 'Penerapan Pagination & Filtering', deskripsi: 'Tambahkan query params di endpoint GET', prioritas: 'tinggi', tenggat: '2026-11-10' },
  { judul: 'Menyusun Laporan Praktikum', deskripsi: 'Ambil screenshot hasil pengujian Postman', prioritas: 'sedang', tenggat: '2026-11-12' },
  { judul: 'Push Code ke Repositori GitHub', deskripsi: 'Commit seluruh fitur baru ke branch main', prioritas: 'tinggi', tenggat: '2026-11-13' },
  { judul: 'Submit Link SPON', deskripsi: 'Kirimkan link repositori sebelum tenggat', prioritas: 'tinggi', tenggat: '2026-11-14' },
];

async function main() {
  const uri = process.env.DB_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Variabel koneksi database (DB_URI / MONGODB_URI) belum diatur di .env');
  }

  await mongoose.connect(uri);
  
  // Hapus data lama agar seeding bersih
  await Task.deleteMany({});
  await Category.deleteMany({});

  // 1. Inisialisasi Data Kategori (Referencing Target)
  const categories = await Category.insertMany([
    { nama: 'Kuliah PAW', deskripsi: 'Tugas praktikum dan kuis web development', warna: '#dc3545' },
    { nama: 'Proyek UI/UX', deskripsi: 'Pengembangan antarmuka aplikasi mobile/web', warna: '#0d6efd' },
    { nama: 'Administrasi', deskripsi: 'Persiapan dokumen dan urusan kampus', warna: '#198754' },
  ]);

  // 2. Pemetaan Data Task dengan Referencing (kategori) dan Embedding (catatan)
  const tasks = DUMMY_TASKS.map((item, index) => ({
    judul: item.judul,
    deskripsi: item.deskripsi,
    prioritas: item.prioritas,
    tenggat: new Date(item.tenggat),
    selesai: index % 3 === 0, // Mengatur variasi status selesai (true/false)
    kategori: categories[index % categories.length]._id, // Referencing ID Kategori secara bergantian
    catatan: [ // Embedding Sub-dokumen Catatan
      { teks: `Catatan awal untuk tugas: ${item.judul}` },
      { teks: 'Pastikan dikerjakan tepat waktu.' }
    ]
  }));

  await Task.insertMany(tasks);

  console.log(`Seed selesai: ${categories.length} kategori, ${tasks.length} tugas berhasil dibuat.`);
  await mongoose.disconnect();
}

main().catch((err) => { 
  console.error('Error saat Seeding:', err.message); 
  process.exit(1); 
});