const router = require("express").Router()
const controller = require("../controllers/noteController")
const verifyJWT = require("../middleware/verifyJWT")


router.route("/")
    .get(controller.getAllNotes)
    .post(controller.addNewNote)
    .patch(controller.updateNote)
    .delete(controller.deleteNote)


module.exports = router