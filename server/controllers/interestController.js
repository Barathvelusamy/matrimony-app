const Interest = require("../models/Interest");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Notification = require("../models/Notification");

const notify = (user, type, message) =>
  Notification.create({ user, type, message }).catch(() => {});

const attachProfiles = async (interests, key) => {
  const valid = interests.filter((i) => i[key]);
  const ids = valid.map((i) => i[key]._id);
  const profiles = await Profile.find({ user: { $in: ids } }).select(
    "user photo city education occupation dateOfBirth"
  );

  const map = {};
  profiles.forEach((p) => {
    map[String(p.user)] = p;
  });

  return valid.map((i) => {
    const obj = i.toObject();
    obj.profile = map[String(i[key]._id)] || null;
    return obj;
  });
};

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

    const me = await User.findById(req.user.id).select("name");
    await notify(
      toUser,
      "interest_received",
      `${me?.name || "Someone"} sent you an interest`
    );

    res.status(201).json({ message: "Interest sent", interest });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReceived = async (req, res) => {
  try {
    const interests = await Interest.find({ to: req.user.id })
      .populate("from", "name")
      .sort({ createdAt: -1 });
    res.json(await attachProfiles(interests, "from"));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSent = async (req, res) => {
  try {
    const interests = await Interest.find({ from: req.user.id })
      .populate("to", "name")
      .sort({ createdAt: -1 });
    res.json(await attachProfiles(interests, "to"));
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

    const me = await User.findById(req.user.id).select("name");
    await notify(
      interest.from,
      status === "accepted" ? "interest_accepted" : "interest_rejected",
      `${me?.name || "Someone"} ${status} your interest`
    );

    res.json({ message: `Interest ${status}`, interest });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};