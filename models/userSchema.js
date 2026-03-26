const mongoose = require('mongoose')
const connect = mongoose.connect("mongodb://127.0.0.1:27017/task-manager")
connect.then(() =>{
    console.log("Database connected succefuly")
}).catch(() => {
    console.log("Database cannot connect")
})



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true });


userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
// models/userSchema.js



const users = new mongoose.model("Users",userSchema)
module.exports = users