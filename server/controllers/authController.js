const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtpEmail } = require("../utils/mailer");

const OTP_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const isTest = process.env.NODE_ENV === "test";

const clean = (e) => String(e || "").toLowerCase().trim();
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const issueOtp = async (user) => {
  const otp = String(crypto.randomInt(100000, 1000000));
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpires = new Date(Date.now() + OTP_MINUTES * 60 * 1000);
  user.otpAttempts = 0;
  await user.save();
  if (!isTest) await sendOtpEmail(user.email, user.name, otp);
  return otp;
};

// true when a code was sent less than a minute ago
const tooSoon = (user) =>
  user.otpExpires && user.otpExpires.getTime() - Date.now() > 9 * 60 * 1000;

const codeSent = (email, otp) => {
  const body = { message: "A code has been sent to your email", email };
  if (isTest) body.devOtp = otp;
  return body;
};

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = clean(req.body.email);

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }
    if (!emailOk(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    let user = await User.findOne({ email });
    if (user && user.verified) {
      return res.status(400).json({ message: "Email already registered. Please login." });
    }

    const isNew = !user;
    if (user) {
      if (tooSoon(user)) {
        return res.status(429).json({ message: "Please wait a minute before requesting another code" });
      }
      user.name = name;
    } else {
      user = new User({ name, email });
    }

    let otp;
    try {
      otp = await issueOtp(user);
    } catch (mailErr) {
      console.error("OTP email failed:", mailErr.message);
      if (isNew) await User.deleteOne({ _id: user._id });
      return res.status(500).json({
        message: "Could not send the email. Check the address and try again.",
      });
    }

    res.status(201).json(codeSent(email, otp));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const email = clean(req.body.email);

    if (!emailOk(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for this email. Please register." });
    }
    if (tooSoon(user)) {
      return res.status(429).json({ message: "Please wait a minute before requesting another code" });
    }

    let otp;
    try {
      otp = await issueOtp(user);
    } catch (mailErr) {
      console.error("OTP email failed:", mailErr.message);
      return res.status(500).json({ message: "Could not send the email. Try again later." });
    }

    res.json(codeSent(email, otp));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const email = clean(req.body.email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found for this email" });
    }
    if (tooSoon(user)) {
      return res.status(429).json({ message: "Please wait a minute before requesting another code" });
    }

    let otp;
    try {
      otp = await issueOtp(user);
    } catch (mailErr) {
      console.error("OTP email failed:", mailErr.message);
      return res.status(500).json({ message: "Could not send the email. Try again later." });
    }

    res.json(codeSent(email, otp));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const email = clean(req.body.email);
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otpHash) {
      return res.status(400).json({ message: "No code requested. Please request a new code." });
    }
    if (user.otpAttempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Too many wrong attempts. Request a new code." });
    }
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Code expired. Request a new code." });
    }

    const ok = await bcrypt.compare(otp, user.otpHash);
    if (!ok) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Wrong code" });
    }

    user.verified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otpHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};