require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const User = require("./models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const col = User.collection;

  const existing = await col
    .find({ username: { $exists: true, $ne: null } }, { projection: { username: 1 } })
    .toArray();
  const taken = new Set(existing.map((u) => u.username));

  const legacy = await col
    .find({ $or: [{ username: { $exists: false } }, { username: null }] })
    .toArray();

  for (const u of legacy) {
    let base = String(u.email || u.name || "user")
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    base = base.padEnd(3, "0").slice(0, 16);

    let candidate = base;
    let i = 1;
    while (taken.has(candidate)) candidate = `${base}${i++}`;
    taken.add(candidate);

    await col.updateOne({ _id: u._id }, { $set: { username: candidate } });
    console.log(`${u.email || u.name}  ->  ${candidate}`);
  }

  await User.syncIndexes();
  console.log(`Done. ${legacy.length} users updated.`);
  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});