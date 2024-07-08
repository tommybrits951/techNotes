const User = require("../models/User")
const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean()
    if (!users) {
        return res.status(400).json({message: "No users found!"})
    }
    res.status(200).json(users)
})


const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, roles} = req.body;
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: "All fields required!"})
    }
    const duplicate = await User.findOne({username}).lean().exec()
    if (duplicate) {
        return res.status(409).json({message: "Duplicate usernames!"})
    }
    const hash = await bcrypt.hash(password, 10)

    const userObject = {username, password: hash, roles}

    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({message: "invalid user data received!"})
    }
})


const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password} = req.body;
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({message: "All fields required!"})
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({message: "User not found!"})
    }
    const duplicate = await User.findOne({username}).lean().exec()
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({message: "Duplicate username!"})
    }
    user.username = username
    user.roles = roles
    user.active = active
    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save()
    res.json({message: `${updatedUser.username} updated!`})
})


const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.status(400).json({message: "User ID required!"})
    }
    const note = await Note.findOne({user: id}).lean().exec()
    if (note) {
        return res.status(400).json({message: "User has assigned notes!"})
    }
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({message: "User not found!"})
    }
    const result = await user.deleteOne()
    const reply = `Username ${result.username} with ID ${result._id} deleted!`
    res.json(reply)
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}