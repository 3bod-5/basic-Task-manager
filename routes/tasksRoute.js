const express = require('express')
const router = express.Router()
const tasksController = require('../controller/tasksController')
const authController = require('../controller/authController')
router
    .route('/dashboard')
    .get(authController.protect,tasksController.dashboard) 
router
    .route('/dashboard/create-task')
    .get(tasksController.createTaskPage)
    .post(authController.protect,tasksController.createTask)  
router
    .route('/dashboard/delete-task/:id')
    .post(authController.protect,tasksController.deleteTask)  
router
    .route('/dashboard/update-task/:id')
    .get(tasksController.updateTaskPage)
    .post(authController.protect,tasksController.updateTask)          
module.exports = router   