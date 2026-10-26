const express = require("express");
const {
  getProfilesByStatus,
  updateProfileStatus,
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/profiles", auth, admin, getProfilesByStatus);
router.patch("/profiles/:id/status", auth, admin, updateProfileStatus);

module.exports = router;