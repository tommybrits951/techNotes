const Note = require("../models/Note")
const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const addNewNote = asyncHandler(async (req, res) => {
    const {title, text, user} = req.body;
    if (!title || !text || !user) {
        return res.status(400).json({message: "All fields required!"})
    }
    console.log(user    )
    const duplicate = await User.findOne({_id: user}).lean().exec()
    if (!duplicate) {
        return res.status(400).json({message: "user required for post!"})
    }
    const note = await Note.create(req.body)
    if (!note) {
        return res.status(400).json({message: "Could not post note"})
    }
    res.status(201).json({message: "Note posted"})
})


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find()
    if (!notes) {
        return res.status(400).json({message: "Couldn't get notes!"})
    }
    
    let results = []
    for (let i = 0; i < notes.length; i++) {

        const user = await User.findById(notes[i].user).lean().exec()
        const tmp = {...notes[i]._doc, username: user.username}
        results = [...results, tmp]
    }
    
    res.json(results)
})
const updateNote = asyncHandler(async (req, res) => {
    const {title, id, text, completed} = req.body
    let note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({message: "Couldn't get note!"})
    }
    note.title = title
    note.text = text
    note.completed = completed
    const updatedNote = await note.save()
    res.json({message: `Note ${updatedNote.title} has been updated!`})
})
const deleteNote = asyncHandler(async (req, res) => {
    const {id} = req.body
    if (!id) {
        return res.status(400).json({message: "Note ID required!"})
    }
    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({message: "Couldn't retreive note!"})
    }
    const result = await note.deleteOne()
    const reply = `Note ${result.title} with ID ${id} has been deleted`
    res.json({message: reply})
})


module.exports = {
    addNewNote,
    getAllNotes,
    updateNote,
    deleteNote
}