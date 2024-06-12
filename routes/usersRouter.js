const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bodyParser = require("body-parser");
const requireAuth = require("../middlewares/authMiddleware");

router.post("/signup", bodyParser.urlencoded({ extended: false }), userController.signup);
router.post("/login", bodyParser.urlencoded({ extended: false }), userController.login);
router.get("/logout", requireAuth(), userController.logout);

module.exports = router;
