const Task = require("../models/taskModel");
const Category = require("../models/categoryModel");

// 1. GET Semua Tugas (Filtering, Sorting, Projection, Pagination, Populate)
exports.getAll = async (req, res, next) => {
  try {
    const { prioritas, selesai, sort, page = 1, limit = 5, fields } = req.query;

    // Filtering
    const queryObj = {};
    if (prioritas) queryObj.prioritas = prioritas;
    if (selesai !== undefined) queryObj.selesai = selesai === "true";

    let query = Task.find(queryObj);

    // Sorting
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Projection
    if (fields) {
      const fieldList = fields.split(",").join(" ");
      query = query.select(fieldList);
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    query = query.skip(skip).limit(limitNum);

    // Populate data Referencing Kategori
    query = query.populate("kategori", "nama warna");

    const tasks = await query;
    const totalData = await Task.countDocuments(queryObj);

    res.status(200).json({
      status: "success",
      results: tasks.length,
      totalData,
      currentPage: pageNum,
      totalPages: Math.ceil(totalData / limitNum),
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET Tugas berdasarkan ID
exports.getById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "kategori",
      "nama warna",
    );
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: `Data tugas dengan ID ${req.params.id} tidak ditemukan`,
      });
    }
    res.status(200).json({
      status: "success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST Tambah Tugas Baru
exports.create = async (req, res, next) => {
  try {
    const { judul, deskripsi, prioritas, tenggat, selesai, kategori, catatan } =
      req.body;

    if (!judul || !prioritas || !tenggat || !kategori) {
      return res.status(400).json({
        status: "fail",
        message: "judul, prioritas, tenggat, dan kategori wajib diisi",
      });
    }

    const newTask = await Task.create({
      judul,
      deskripsi: deskripsi || "",
      prioritas,
      tenggat,
      selesai: selesai === true,
      kategori,
      catatan: catatan || [],
    });

    res.status(201).json({
      status: "success",
      message: "Tugas berhasil ditambahkan",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// 4. PUT Ubah Tugas
exports.update = async (req, res, next) => {
  try {
    const { judul, deskripsi, prioritas, tenggat, selesai, kategori, catatan } =
      req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        judul,
        deskripsi,
        prioritas,
        tenggat,
        selesai,
        kategori,
        catatan,
      },
      { new: true, runValidators: true },
    ).populate("kategori", "nama warna");

    if (!updatedTask) {
      return res.status(404).json({
        status: "fail",
        message: `Data tugas dengan ID ${req.params.id} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `Data tugas berhasil diperbarui`,
      data: updatedTask,
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
        status: "fail",
        message: `Data tugas dengan ID ${req.params.id} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data tugas berhasil dihapus",
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};
