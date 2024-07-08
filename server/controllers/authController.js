require("dotenv").config()
const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const accessSecret = process.env.ACCESS_TOKEN_SECRET
const refreshSecret = process.env.REFRESH_tOKEN_SECRET

function buildRefresh(user) {
    const payload = {
        "username": user.username
    }
    const options = {
        expiresIn: "1d"
    }
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options)
}
function buildAccess(user) {
    const payload = {
        UserInfo: {
            "username": user.username,
            "roles": user.roles
        }
    }
    const options = {
        expiresIn: "1h"
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options)

}



const login = asyncHandler(async (req, res) => {
    console.log(process.env.REFRESH_SECRET)
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "All fields required!"})
    }
    const foundUser = await User.findOne({username}).exec()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({message: "Unauthorized!"})
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({message: "Unauthorized!"})
    }
    const refreshToken = buildRefresh(foundUser)
    const accessToken = buildAccess(foundUser)
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.json({accessToken})
})

const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({message: "Unauthorized!"})
    const refreshToken = cookies.jwt;
    jwt.verify(refreshToken, refreshSecret, 
        asyncHandler(async (err, decoded) => {
            if (err) {
                return res.status(403).json({message: "Forbidden!"})
            }
            const foundUser = await User.findOne({username: decoded.username})
            if (!foundUser) return res.status(401).json({message: "Unauthorized!"})
            const accessToken = buildAccess(foundUser)
            res.json({accessToken})
        })
    )

}

const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie("jwt", {httpOnly: true, sameSite: "None", secure: true})
    res.json({message: "Cookie cleared!"})
}

module.exports = {
    login,
    refresh, 
    logout
}