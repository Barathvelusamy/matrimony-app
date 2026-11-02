require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Profile = require("./models/Profile");

const people = [
  { name: "Arun", gender: "male", dob: "1997-02-14", height: 172, education: "B.E", occupation: "Software Engineer", city: "Coimbatore", religion: "Hindu", star: "Rohini" },
  { name: "Karthik", gender: "male", dob: "1995-07-21", height: 175, education: "MBA", occupation: "Business Analyst", city: "Chennai", religion: "Hindu", star: "Hastham" },
  { name: "Vignesh", gender: "male", dob: "1998-11-05", height: 170, education: "B.Com", occupation: "Accountant", city: "Madurai", religion: "Hindu", star: "Anusham" },
  { name: "Mohammed", gender: "male", dob: "1996-04-18", height: 174, education: "MCA", occupation: "QA Engineer", city: "Salem", religion: "Muslim", star: "" },
  { name: "Joseph", gender: "male", dob: "1994-09-09", height: 178, education: "M.Sc", occupation: "Teacher", city: "Trichy", religion: "Christian", star: "" },
  { name: "Suresh", gender: "male", dob: "1993-12-30", height: 169, education: "Diploma", occupation: "Supervisor", city: "Erode", religion: "Hindu", star: "Mrigashira" },
  { name: "Divya", gender: "female", dob: "1998-03-12", height: 158, education: "B.E", occupation: "Engineer", city: "Coimbatore", religion: "Hindu", star: "Rohini" },
  { name: "Meena", gender: "female", dob: "1999-06-25", height: 160, education: "B.Sc", occupation: "Lab Technician", city: "Chennai", religion: "Hindu", star: "Pooram" },
  { name: "Ayesha", gender: "female", dob: "1997-01-08", height: 162, education: "MBA", occupation: "HR Executive", city: "Salem", religion: "Muslim", star: "" },
  { name: "Grace", gender: "female", dob: "1996-10-17", height: 157, education: "B.Ed", occupation: "Teacher", city: "Madurai", religion: "Christian", star: "" },
  { name: "Lakshmi", gender: "female", dob: "2000-05-02", height: 155, education: "B.Com", occupation: "Bank Clerk", city: "Erode", religion: "Hindu", star: "Uthiram" },
  { name: "Nandhini", gender: "female", dob: "1998-08-19", height: 163, education: "MCA", occupation: "Software Tester", city: "Trichy", religion: "Hindu", star: "Swathi" },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash("demo1234", 10);
  let added = 0;

  for (const p of people) {
    const email = `${p.name.toLowerCase()}@demo.com`;
    if (await User.findOne({ email })) continue;

    const user = await User.create({ name: p.name, email, password: hash });
    await Profile.create({
      user: user._id,
      gender: p.gender,
      dateOfBirth: new Date(p.dob),
      height: p.height,
      education: p.education,
      occupation: p.occupation,
      city: p.city,
      state: "Tamil Nadu",
      religion: p.religion,
      star: p.star,
      about: "Demo profile for the portfolio app.",
      status: "approved",
    });
    added++;
  }

  console.log(`Added ${added} demo profiles`);
  await mongoose.connection.close();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});