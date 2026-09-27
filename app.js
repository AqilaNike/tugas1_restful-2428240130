// impor express
const express = require("express");
// instansiasi aplikasi express
const app = express();
// PORT: memakai environment variable saat di Vercel, atau 3000 saat lokal
const PORT = process.env.PORT || 3000;

// Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

// Data sementara (disimpan di memori, hilang saat server restart)
// Topik 18 - Produktivitas: Daftar Tugas
let tasks = [
  {
    id: 1,
    judul: "Kerjakan Tugas 1 Express",
    deskripsi: "CRUD + filter",
    prioritas: "tinggi",
    tenggat: "2026-10-05",
    selesai: false,
  },
  {
    id: 2,
    judul: "Review Materi Dasar Teori REST",
    deskripsi: "Baca ulang slide pertemuan 3-4",
    prioritas: "sedang",
    tenggat: "2026-10-01",
    selesai: false,
  },
  {
    id: 3,
    judul: "Push project ke GitHub",
    deskripsi: "Minimal 5 commit bertahap",
    prioritas: "tinggi",
    tenggat: "2026-10-06",
    selesai: true,
  },
];
let nextId = 4; // penghitung id untuk data baru

// GET / -> menampilkan info API (identitas & daftar endpoint)
app.get("/", (req, res) => {
  res.json({
    nama: "Aqila Nike Indriani",
    nim: "2428240130",
    kelas: "SI5C",
    topik: "18 - Produktivitas: Daftar Tugas",
    endpoints: [
      "GET /tasks",
      "GET /tasks/:id",
      "GET /tasks?prioritas=nilai",
      "POST /tasks",
      "PUT /tasks/:id",
      "DELETE /tasks/:id",
    ],
  });
});

// GET /tasks -> menampilkan semua data, atau hasil filter ?prioritas=...
app.get("/tasks", (req, res) => {
  const { prioritas } = req.query;

  if (prioritas) {
    const hasil = tasks.filter((t) => t.prioritas === prioritas);
    return res.json(hasil); // array langsung, boleh kosong []
  }

  res.json(tasks); // array langsung, tanpa status/message
});

// GET /tasks/:id -> menampilkan satu data berdasarkan id
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = tasks.find((t) => t.id === id);

  if (!data) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  res.json(data); // objek langsung, tanpa status/message
});

// POST /tasks
// Body: { "judul": "...", "deskripsi": "...", "prioritas": "tinggi", "tenggat": "2026-10-05", "selesai": false }
app.post("/tasks", (req, res) => {
  const { judul, deskripsi, prioritas, tenggat, selesai } = req.body;

  // validasi field wajib: judul, prioritas, tenggat
  if (!judul || !prioritas || !tenggat) {
    return res.status(400).json({
      status: "error",
      message: "judul, prioritas, dan tenggat wajib diisi",
      data: null,
    });
  }

  const baru = {
    id: nextId++,
    judul,
    deskripsi: deskripsi || "",
    prioritas,
    tenggat,
    selesai: selesai === true,
  };

  tasks.push(baru);

  // berhasil -> 201 + data yang baru dibuat
  res.status(201).json({
    status: "success",
    message: "Data berhasil ditambahkan",
    data: baru,
  });
});

// PUT /tasks/:id
// Body: seluruh field wajib (penggantian penuh)
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  const { judul, deskripsi, prioritas, tenggat, selesai } = req.body;

  // validasi field wajib: judul, prioritas, tenggat
  if (!judul || !prioritas || !tenggat) {
    return res.status(400).json({
      status: "error",
      message: "judul, prioritas, dan tenggat wajib diisi",
      data: null,
    });
  }

  const diperbarui = {
    id,
    judul,
    deskripsi: deskripsi || "",
    prioritas,
    tenggat,
    selesai: selesai === true,
  };

  tasks[index] = diperbarui;

  res.status(200).json({
    status: "success",
    message: `Data tugas dengan id ${id} berhasil diperbarui`,
    data: diperbarui,
  });
});

// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data dengan id ${id} tidak ditemukan`,
      data: null,
    });
  }

  tasks.splice(index, 1);

  res.status(200).json({
    status: "success",
    message: `Data tugas dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// Middleware catch-all -> menangani route yang tidak terdaftar (harus di paling akhir)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

// Menjalankan server hanya saat bukan di lingkungan production (Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Ekspor app agar bisa dijalankan sebagai serverless function di Vercel
module.exports = app;
