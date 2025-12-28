const express = require('express');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(express.json());

// 🔴 LOG CRITICAL
app.use((req, res, next) => {
    console.log('[TASK SERVICE]', req.method, req.url, req.body);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        service: 'task-service',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Task routes
app.use('/tasks', taskRoutes);

module.exports = app;
