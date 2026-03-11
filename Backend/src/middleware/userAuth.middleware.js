const jwt = require("jsonwebtoken")
const redis = require("../config/cache")
const userModel = require("../model/user.model")


async function userAuth(req, res, next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(400).json({
            message:"token not provided"
        })
    }

    const isTokenBlackListed = await redis.get(token)

    if(isTokenBlackListed){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.TOKEN
        )

        res.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}


module.exports = userAuth