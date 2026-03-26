const express = require('express')
const app = express()
const authRoute = require('./routes/authRoute')
const taskRoute = require('./routes/tasksRoute')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

app.use('/',authRoute)
//only user routes
app.use('/',taskRoute)
app.get('/Home',(req,res)=>{
    res.render('home')
})

module.exports = app


