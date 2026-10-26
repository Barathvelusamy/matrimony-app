const express = require("express");
const {
  saveProfile,
  getMyProfile,
  searchProfiles,
} = require("../controllers/profileController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, saveProfile);
router.get("/me", auth, getMyProfile);
router.get("/search", auth, searchProfiles);

module.exports = router;