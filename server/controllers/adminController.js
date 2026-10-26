const Profile = require("../models/Profile");

exports.getProfilesByStatus = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const profiles = await Profile.find({ status }).populate("user", "name email");
    res.json({ total: profiles.length, profiles });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfileStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "blocked", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: `Profile ${status}`, profile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};