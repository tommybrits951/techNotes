const router = require("express").Router()
const controller = require("../controllers/userController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT) 
router.route("/")
    .get(controller.getAllUsers)
    .post(controller.createNewUser)
    .patch(controller.updateUser)
    .delete(controller.deleteUser)

module.exports = router