const taskService = require('../services/task.service');
const publishEvent = require("../kafka/publishEvent");

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask({
            ...req.body,
            userId: req.user.id
        });
        await publishEvent({
            topic: "task.events",
            eventType: "task.created",
            payload: {
                taskId: task.id,
                userId: task.userId,
                title: task.title,
                dueDate: task.dueDate,
            },
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
        const existingTask = await taskService.getTaskById(
            req.params.id,
            req.user.id
        );

        const task = await taskService.updateTask(
            req.params.id,
            req.user.id,
            req.body
        );

        // 🔔 BUSINESS EVENT: completed
        const wasCompleted =
            existingTask.status !== "done" &&
            task.status === "done";

        if (wasCompleted) {
            await publishEvent({
                topic: "task.events",
                eventType: "task.completed",
                payload: {
                    taskId: task.id,
                    userId: task.userId,
                    title: task.title
                }
            });
        }

        res.json(task);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(
            req.params.id,
            req.user.id
        );

        await taskService.deleteTask(
            req.params.id,
            req.user.id
        );

        // 🔔 BUSINESS EVENT: deleted
        await publishEvent({
            topic: "task.events",
            eventType: "task.deleted",
            payload: {
                taskId: task.id,
                userId: task.userId,
                title: task.title
            }
        });

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
