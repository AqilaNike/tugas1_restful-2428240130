const express = require('express');
const router = express.Router();

// IMPOOR CONTROLLER DI SINI
const taskController = require('../controllers/taskController');

// Pemetaan Rute
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;