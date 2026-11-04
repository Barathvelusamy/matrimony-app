const express = require("express");
const {
  register,
  login,
  getMe,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.get("/me", auth, getMe);

module.exports = router;