const express = require("express");
const { getMine, markAllRead } = require("../controllers/notificationController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getMine);
router.post("/read-all", auth, markAllRead);

module.exports = router;