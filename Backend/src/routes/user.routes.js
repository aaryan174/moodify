const express = require("express");
const { registerController, loginController } = require("../controller/user.controller");

const Router = express.Router();



// register user POST ROUTE
Router.post("/register", registerController)
// login user PostROUTE
Router.post("/login", loginController)




module.exports = Router