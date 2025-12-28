const Task = require('../models/Task.model');
const { AppError } = require('../utils/errors');

const createTask = async (taskData) => {
    return Task.create(taskData);
};

const getTasksByUser = async (userId, query) => {
    const {
        status,
        priority,
        page = 1,
        limit = 10
    } = query;

    const filters = { userId };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
        Task.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        Task.countDocuments(filters)
    ]);

    return {
        data: tasks,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

const getTaskById = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
        throw new AppError('Task not found', 404);
    }
    return task;
};

const updateTask = async (taskId, userId, updateData) => {
    const task = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!task) {
        throw new AppError('Task not found', 404);
    }

    return task;
};

const deleteTask = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
        throw new AppError('Task not found', 404);
    }

    await task.softDelete();
};

module.exports = {
    createTask,
    getTasksByUser,
    getTaskById,
    updateTask,
    deleteTask
};
