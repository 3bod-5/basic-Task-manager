const Task = require('../models/taskSchema')
const catchAsync = require('../utils/catchAsync');




exports.dashboard = catchAsync(async (req, res) => {
    const userTasks = await Task.find({ user: req.user.id });

    res.render('taskViews/dashboard', {
        tasks: userTasks
    });
});

exports.createTaskPage = catchAsync(async(req,res)=>{
    res.render('taskViews/createTaskPage');
})
exports.createTask = catchAsync(async (req, res) => {
    const task = await Task.create({
        ...req.body,
        user: req.user.id
    });

    res.redirect('/dashboard')
});
exports.updateTaskPage = catchAsync(async(req,res)=>{
    const task = await Task.findOne({_id:req.params.id})
    res.render('taskViews/updateTaskPage',{task:task});
})
exports.updateTask = catchAsync(async (req, res) => {
    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id }, // 🔐 ensure task belongs to user
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedTask) {
        return res.status(404).json({
            status: "fail",
            message: "Task not found"
        });
    }

    res.redirect('/dashboard')
});
exports.deleteTask = catchAsync(async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id // 🔐 make sure user owns the task
    });

    if (!task) {
        return res.status(404).json({
            status: "fail",
            message: "Task not found"
        });
    }

    res.redirect('/dashboard')
});