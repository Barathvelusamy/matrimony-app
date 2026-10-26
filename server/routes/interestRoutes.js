const express = require("express");
const {
  sendInterest,
  getReceived,
  getSent,
  respondToInterest,
} = require("../controllers/interestController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/send/:userId", auth, sendInterest);
router.get("/received", auth, getReceived);
router.get("/sent", auth, getSent);
router.patch("/:id", auth, respondToInterest);

module.exports = router;