require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  const [email, newPass] = process.argv.slice(2);

  if (!email || !newPass) {
    console.log("Usage: node setPassword.js <email> <newPassword>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log("User not found:", email);
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPass, 10);
  await User.updateOne({ _id: user._id }, { $set: { password: hash } });

  console.log("Password updated for", email);
  process.exit(0);
})();