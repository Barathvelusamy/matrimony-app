const Profile = require("../models/Profile");
const cloudinary = require("cloudinary").v2;

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

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Save your profile details first" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "matrimony",
          transformation: [{ width: 500, height: 500, crop: "fill", gravity: "face" }],
        },
        (err, uploaded) => (err ? reject(err) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    profile.photo = result.secure_url;
    await profile.save();

    res.json({ message: "Photo uploaded", photo: profile.photo });
  } catch (err) {
    res.status(500).json({ message: "Photo upload failed" });
  }
};

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, uploaded) =>
      err ? reject(err) : resolve(uploaded)
    );
    stream.end(buffer);
  });

exports.addGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Save your profile details first" });
    }

    if (profile.photos.length >= 5) {
      return res.status(400).json({ message: "You can add up to 5 photos" });
    }

    const result = await uploadBuffer(req.file.buffer, {
      folder: "matrimony/gallery",
      transformation: [{ width: 900, height: 900, crop: "limit" }],
    });

    profile.photos.push(result.secure_url);
    await profile.save();

    res.json({ message: "Photo added", photos: profile.photos });
  } catch (err) {
    res.status(500).json({ message: "Photo upload failed" });
  }
};

exports.removeGalleryPhoto = async (req, res) => {
  try {
    const { url } = req.body;
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.photos = profile.photos.filter((p) => p !== url);
    await profile.save();

    res.json({ message: "Photo removed", photos: profile.photos });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfileByUser = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      "name"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isOwner = String(profile.user._id) === req.user.id;
    if (profile.status !== "approved" && !isOwner) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
   } catch (err) {
    console.error("Gallery upload error:", err.message);
    res.status(500).json({ message: "Photo upload failed" });
  }
};