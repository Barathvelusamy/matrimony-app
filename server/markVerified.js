require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const User = require("./models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateMany(
    { verified: { $ne: true } },
    { $set: { verified: true } }
  );
  console.log(`Marked ${result.modifiedCount} existing users as verified`);
  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});