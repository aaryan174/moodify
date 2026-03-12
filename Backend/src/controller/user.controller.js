const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userModel = require("../model/user.model");
const redis = require("../config/cache");



async function registerController(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "user already exists"
        })
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, email, password: hashPassword
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.TOKEN, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(201).json({
        message: "user register succussfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


async function loginController(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "Invalid credential"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.TOKEN, { expiresIn: "3d" })

    res.cookie("token", token)

    return res.status(200).json({
        message: "user logged in succussfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User Fetched succussfully",
        user
    })
}

async function logoutController(req, res) {
    const token = req.cookies.token
    res.clearCookie("token")

    await redis.set(token, Date.now(), "EX", 60 * 60)

    res.status(200).json({
        message: "logout succussfully"
    })
}

module.exports = {
    registerController,
    loginController,
    getMeController,
    logoutController
}