const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 🔒 Protect all task routes
router.use(authMiddleware);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
