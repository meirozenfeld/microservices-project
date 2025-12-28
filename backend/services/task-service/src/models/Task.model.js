const mongoose = require('mongoose');

const TASK_STATUS = ['open', 'in_progress', 'done'];
const TASK_PRIORITY = ['low', 'medium', 'high'];

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000
        },

        status: {
            type: String,
            enum: TASK_STATUS,
            default: 'open'
        },

        priority: {
            type: String,
            enum: TASK_PRIORITY,
            default: 'medium'
        },

        dueDate: {
            type: Date
        },

        userId: {
            type: String,
            required: true,
            index: true
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// 🔹 Soft delete helper
TaskSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// 🔹 Query helper – exclude deleted by default
TaskSchema.pre(/^find/, function () {
    this.where({ isDeleted: false });
});


module.exports = mongoose.model('Task', TaskSchema);
