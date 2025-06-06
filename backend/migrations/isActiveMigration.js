// migrate users so that all the existing users have isActive property set:
// Still need to run the migration
// How to run this migration:

// Save: Save the above code as a JavaScript file (e.g., scripts/migrate-users.js) in your Node.js project.
//  Make sure the require path to your User model is correct.
// Update URI: Crucially, use your actual MongoDB connection string and database name.
// Execute: Run the script from your terminal:
// Bash: node migrations/isActiveMigration.js

const mongoose = require("mongoose");
const User = require("../models/userModel");

const isActiveMigration = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const result = await User.UpdateMany(
      { isActive: { $exists: false } },
      { isActive: true, updatedAt: Date.now() }
    );

    console.log(
      `Migration Complete: ${result.matchedCount} users matched, ${result.modifiedCount} users updated`
    );

    console.log("Mongodb connection successful");
  } catch (error) {
    console.error("error connecting to mongo", error);
  } finally {
    await mongoose.disconnect();
    console.log("Mongodb disconnected");
    process.exit(0);
  }
};

isActiveMigration();
