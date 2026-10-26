const Profile = require("../models/Profile");

exports.saveProfile = async (req, res) => {
  try {
    const {
      gender, dateOfBirth, height, maritalStatus, religion, community,
      star, education, occupation, city, state, about,
    } = req.body;

    if (!gender || !dateOfBirth || !education || !city) {
      return res
        .status(400)
        .json({ message: "gender, dateOfBirth, education and city are required" });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      {
        gender, dateOfBirth, height, maritalStatus, religion, community,
        star, education, occupation, city, state, about,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: "Profile saved", profile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchProfiles = async (req, res) => {
  try {
    const { gender, minAge, maxAge, city, education, religion } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = { status: "approved", user: { $ne: req.user.id } };

    if (gender) filter.gender = gender;
    if (city) filter.city = new RegExp(city, "i");
    if (education) filter.education = new RegExp(education, "i");
    if (religion) filter.religion = new RegExp(religion, "i");

    if (minAge || maxAge) {
      filter.dateOfBirth = {};
      const today = new Date();
      if (minAge) {
        const latest = new Date(today);
        latest.setFullYear(today.getFullYear() - Number(minAge));
        filter.dateOfBirth.$lte = latest;
      }
      if (maxAge) {
        const earliest = new Date(today);
        earliest.setFullYear(today.getFullYear() - Number(maxAge) - 1);
        filter.dateOfBirth.$gte = earliest;
      }
    }

    const total = await Profile.countDocuments(filter);
    const profiles = await Profile.find(filter)
      .populate("user", "name")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, pages: Math.ceil(total / limit), profiles });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};