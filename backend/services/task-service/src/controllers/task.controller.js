const taskService = require('../services/task.service');

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const result = await taskService.getTasksByUser(
            req.user.id,
            req.query
        );
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(
            req.params.id,
            req.user.id
        );
        res.json(task);
    } catch (error) {
        res.status(error.statusCode || 404).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(
            req.params.id,
            req.user.id,
            req.body
        );
        res.json(task);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(
            req.params.id,
            req.user.id
        );
        res.status(204).send();
    } catch (error) {
        res.status(error.statusCode || 404).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};
