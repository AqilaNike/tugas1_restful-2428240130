const Task = require('../models/taskModel');

// 1. GET Semua Tugas (atau Filter berdasarkan prioritas)
exports.getAll = async (req, res, next) => {
  try {
    const { prioritas } = req.query;
    const filter = prioritas ? { prioritas } : {};
    
    const tasks = await Task.find(filter);
    res.status(200).json({
      status: 'success',
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET Tugas berdasarkan ID
exports.getById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: `Data dengan id ${req.params.id} tidak ditemukan`
      });
    }
    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST Tambah Tugas Baru
exports.create = async (req, res, next) => {
  try {
    const { judul, deskripsi, prioritas, tenggat, selesai } = req.body;
    
    if (!judul || !prioritas || !tenggat) {
      return res.status(400).json({
        status: 'fail',
        message: 'judul, prioritas, dan tenggat wajib diisi'
      });
    }

    const newTask = await Task.create({
      judul,
      deskripsi: deskripsi || '',
      prioritas,
      tenggat,
      selesai: selesai === true
    });

    res.status(201).json({
      status: 'success',
      message: 'Data berhasil ditambahkan',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

// 4. PUT Ubah Tugas
exports.update = async (req, res, next) => {
  try {
    const { judul, deskripsi, prioritas, tenggat, selesai } = req.body;
    
    if (!judul || !prioritas || !tenggat) {
      return res.status(400).json({
        status: 'fail',
        message: 'judul, prioritas, dan tenggat wajib diisi'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        judul,
        deskripsi: deskripsi || '',
        prioritas,
        tenggat,
        selesai: selesai === true
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        status: 'fail',
        message: `Data dengan id ${req.params.id} tidak ditemukan`
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Data tugas dengan id ${req.params.id} berhasil diperbarui`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// 5. DELETE Hapus Tugas
exports.remove = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({
        status: 'fail',
        message: `Data dengan id ${req.params.id} tidak ditemukan`
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Data tugas dengan id ${req.params.id} berhasil dihapus`,
      data: null
    });
  } catch (error) {
    next(error);
  }
};