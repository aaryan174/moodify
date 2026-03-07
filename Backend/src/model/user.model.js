const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[true, "username must be filled"],
        unique:[true, "username must be unique"]
    },
    email:{
        type: String,
        required:[true, "email must be filled"],
        unique:[true, "email must be unique"]
    },
    password:{
        type: String,
        required:[true, "password must be filled"]
    }
})


const userModel = mongoose.model("user", userSchema);

module.exports = userModel;