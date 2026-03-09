const express = require("express");
const { registerController } = require("../controller/user.controller");

const Router = express.Router();



// register user POST ROUTE
Router.post("/register", registerController)




module.exports = Router