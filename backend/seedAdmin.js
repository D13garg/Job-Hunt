// Run ONCE to seed the admin account:
//   node seedAdmin.js

require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "dgarg5_be23@thapar.edu" });
  if (existing) {
    console.log("Admin already exists. Skipping seed.");
    process.exit(0);
  }

  await User.create({
    username: "Dron Garg",
    email: "dgarg5_be23@thapar.edu",
    password: "131105",          // pre-save hook will bcrypt this
    role: "admin",
  });

  console.log("Admin seeded successfully.");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
