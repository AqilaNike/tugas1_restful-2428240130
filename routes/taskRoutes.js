const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Pastikan kelima handler ini terdefinisi di controller
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;