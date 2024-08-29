const router = require("express").Router()
const controller = require("../controllers/authController")
const loginLimiter = require("../middleware/loginLimiter")
router.route("/")
    .post(controller.login)
    
router.route("/refresh")
    .get(controller.refresh)

router.route("/logout")
    .post(controller.logout)

module.exports = router