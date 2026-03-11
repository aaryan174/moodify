const express = require("express");
const { registerController,
    loginController,
    getMeController,
    logoutController
} = require("../controller/user.controller");
const userAuth = require("../middleware/userAuth.middleware");

const Router = express.Router();



// register user POST ROUTE
Router.post("/register", registerController);
// login user PostROUTE
Router.post("/login", loginController);
// get-me user getROUTE
Router.get("/get-me", userAuth, getMeController);
// logout user GET
Router.get("/logout", userAuth, logoutController)




module.exports = Router