const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
router
    .route('/register')
    .get(authController.registerPage)
    .post(authController.registerUser)
 
router
    .route('/login')
    .get(authController.loginPage)
    .post(authController.loginUser)    
module.exports = router   