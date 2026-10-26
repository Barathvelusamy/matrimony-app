const Interest = require("../models/Interest");
const Profile = require("../models/Profile");

exports.sendInterest = async (req, res) => {
  try {
    const toUser = req.params.userId;

    if (toUser === req.user.id) {
      return res.status(400).json({ message: "You cannot send interest to yourself" });
    }

    const targetProfile = await Profile.findOne({ user: toUser, status: "approved" });
    if (!targetProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const existing = await Interest.findOne({ from: req.user.id, to: toUser });
    if (existing) {
      return res.status(400).json({ message: "Interest already sent" });
    }

    const interest = await Interest.create({ from: req.user.id, to: toUser });
    res.status(201).json({ message: "Interest sent", interest });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReceived = async (req, res) => {
  try {
    const interests = await Interest.find({ to: req.user.id }).populate("from", "name");
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSent = async (req, res) => {
  try {
    const interests = await Interest.find({ from: req.user.id }).populate("to", "name");
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.respondToInterest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const interest = await Interest.findOne({ _id: req.params.id, to: req.user.id });
    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    interest.status = status;
    await interest.save();

    res.json({ message: `Interest ${status}`, interest });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};