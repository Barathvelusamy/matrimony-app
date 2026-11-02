const express = require("express");
const multer = require("multer");
const {
  saveProfile,
  getMyProfile,
  searchProfiles,
  uploadPhoto,
} = require("../controllers/profileController");
const auth = require("../middleware/auth");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const handleUpload = (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Photo must be under 2 MB" : err.message;
      return res.status(400).json({ message });
    }
    next();
  });
};

router.post("/", auth, saveProfile);
router.get("/me", auth, getMyProfile);
router.get("/search", auth, searchProfiles);
router.post("/photo", auth, handleUpload, uploadPhoto);

module.exports = router;