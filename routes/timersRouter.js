const express = require("express");
const router = express.Router();
const timersController = require("../controllers/timerController");
const requireAuth = require("../middlewares/authMiddleware");

router.use((req, res, next) => {
  console.log(`Received ${req.method} request on ${req.originalUrl}`);
  console.log("Request Params:", req.params);
  next();
});

router.get("/", requireAuth(), timersController.getTimers);
router.post("/", requireAuth(), timersController.createTimer);
router.post("/:id/stop", requireAuth(), timersController.stopTimer);

module.exports = router;
