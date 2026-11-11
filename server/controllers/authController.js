const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const publicUser = (u) => ({ id: u._id, name: u.name, username: u.username });

exports.register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const username = String(req.body.username || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, username and password are required" });
    }
    if (name.length > 50) {
      return res.status(400).json({ message: "Name is too long" });
    }
    if (!USERNAME_RE.test(username)) {
      return res.status(400).json({
        message: "Username must be 3 to 20 characters: letters, numbers and underscore only",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.create({
      name,
      username,
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).json({
      message: "Registered successfully",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already taken" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const id = String(req.body.username || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    if (!id || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // old accounts can still login with their email
    const user = await User.findOne({ $or: [{ username: id }, { email: id }] });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};