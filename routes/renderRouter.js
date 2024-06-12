const express = require("express");
const router = express.Router();
const renderController = require("../controllers/renderController");
const requireAuth = require("../middlewares/authMiddleware");

router.get("/", requireAuth(), renderController.renderPage);

module.exports = router;
