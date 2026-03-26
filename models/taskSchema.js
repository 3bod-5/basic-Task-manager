const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Finished', 'In-Progress', 'Out-Of-Date'],
        default: 'In-Progress'
    },
    Deadline:{
        type:Date,
        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

taskSchema.set("toObject", { virtuals: true });
taskSchema.set("toJSON", { virtuals: true });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;